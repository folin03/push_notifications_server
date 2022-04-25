import { format } from "date-fns";
import { v4 as uuid }  from 'uuid';
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from 'fs';
import fsPromises from 'fs/promises';

export const updateUsersModel = async (data: any) => {
  let stringData = JSON.stringify(data, null, 4);
  await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), stringData); // create file + add data
}
