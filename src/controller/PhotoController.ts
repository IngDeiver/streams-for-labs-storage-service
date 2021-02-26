/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { NextFunction, Response, Request } from 'express';
import { IPhoto } from '../interfaces';
import { HttpException } from '../exceptions';
import { PhotoService } from '../services';
import path from 'path'
/**
 *
 * The Photo controller
 * @category Controllers
 * @class PhotoController
 */
class PhotoController {
  /**
   *
   * List all Photos
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of Photos
   * @memberof PhotoController
   */
  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const author = req.params.author
      const Photos: Array<IPhoto> = await PhotoService.getPhotos(author);
      res.json(Photos);
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }


 /**
   *
   * Get Photo by id
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of Photos
   * @memberof PhotoController
   */
  public static async download(req: any, res: Response, next: NextFunction) {
    try {
      const { id, author } = req.params;
      const photo: IPhoto | null = await PhotoService.getById(id);

      if (!photo) throw new HttpException(404, 'Photo not found');
      if( author != photo.author) throw new HttpException(403, 'Forbidden: The Photo is not his authorship.');

      const host = req.protocol + '://' + req.get('host')
      const location = __dirname + "/../../public" + photo.path.replace(host, "")
      console.log("Location:", location);
      
      res.sendFile(path.resolve(location), photo.name, err => {
        if (err) {
          throw new HttpException(500, err.message);
        } else {
          console.log(`Photo ${photo.name} downloaded`);
          
        }
      })
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }

}
export default PhotoController;
