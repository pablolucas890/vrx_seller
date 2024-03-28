import { IStructure } from './props';

export const API_SERVER_PORT = 8080;
export const API_SERVER_HOST = '192.168.68.131';
export const API_SERVER_PROTOCOL = 'http';
export const SKETCHUP_SERVER_PORT = 4567;
export const SKETCHUP_SERVER_HOST = 'localhost';
export const SKETCHUP_SERVER_PROTOCOL = 'http';

export const STRUCUTRE: IStructure = {
  materials: {
    materialsPath: 'assets/img/materials',
    textures: [
      { id: 'ARENA_35_ACETINADO', name: 'Arena 35 Acetinado' },
      { id: 'ARENA_35_POLIDO', name: 'Arena 35 Polido' },
      { id: 'BIANCO_35_ACETINADO', name: 'Bianco 35 Acetinado' },
      { id: 'BIANCO_35_BRILHANTE', name: 'Bianco 35 Brilhante' },
      { id: 'BIANCO_35_POLIDO', name: 'Biando 35 Polido' },
      { id: 'ARANHA', name: 'Aranha' },
    ],
  },
  enviroments: [
    {
      id: 'env1',
      name: 'Área de Lazer',
      views: [
        {
          id: 'view1',
          name: 'Frontal',
          touchs: [
            { id: 'touch1', x: '65%', y: '70%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
        {
          id: 'view2',
          name: 'Lateral',
          touchs: [
            { id: 'touch1', x: '65%', y: '46%' },
            { id: 'touch3', x: '20%', y: '60%' },
          ],
        },
      ],
    },
    {
      id: 'env2',
      name: 'Banheiro com Lavabo',
      views: [
        {
          id: 'view1',
          name: 'Pia',
          touchs: [
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
      ],
    },
    {
      id: 'env3',
      name: 'Banheiro Social',
      views: [
        {
          id: 'view1',
          name: 'Pia',
          touchs: [
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
      ],
    },
    {
      id: 'env4',
      name: 'Cozinha',
      views: [
        {
          id: 'view1',
          name: 'Pia',
          touchs: [
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
      ],
    },
    {
      id: 'env5',
      name: 'Gourmet',
      views: [
        {
          id: 'view1',
          name: 'Pia',
          touchs: [
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
      ],
    },
    {
      id: 'env6',
      name: 'Sala de Estar',
      views: [
        {
          id: 'view1',
          name: 'Pia',
          touchs: [
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
      ],
    },
    {
      id: 'env7',
      name: 'Sala de Jantar',
      views: [
        {
          id: 'view1',
          name: 'Pia',
          touchs: [
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
      ],
    },
  ],
};
