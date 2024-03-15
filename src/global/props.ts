export interface IMaterial {
  textures: ITexture[];
}

export interface ITexture {
  id: string;
  name: string;
}

export interface IEviroment {
  id: string;
  name: string;
  views: IView[];
}

export interface IView {
  id: string;
  name: string;
  touchs: ITouch[];
}

export interface ITouch {
  id: string;
  x: string;
  y: string;
}

export interface IStructure {
  materials: IMaterial;
  enviroments: IEviroment[];
}
