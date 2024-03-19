import { IStructure } from './props';

// TODO: Mudar as configurações para as do servidor na aws
export const SERVER_PORT = 8080;
export const SERVER_HOST = '0.0.0.0';
export const SERVER_PROTOCOL = 'http';

export const STRUCUTRE: IStructure = {
  materials: {
    // TODO: Mudar o caminho para algo vinculado ao servidor da jadyla
    materialsPath: 'assets/img/materials',
    textures: [
      { id: 'ARENA_35_ACETINADO', name: 'Arena 35 Acetinado' },
      { id: 'ARENA_35_POLIDO', name: 'Arena 35 Polido' },
      { id: 'BIANCO_35_ACETINADO', name: 'Bianco 35 Acetinado' },
      { id: 'BIANCO_35_BRILHANTE', name: 'Bianco 35 Brilhante' },
      { id: 'BIANCO_35_POLIDO', name: 'Biando 35 Polido' },
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
            { id: 'touch1', x: '27%', y: '25%' },
            { id: 'touch2', x: '47%', y: '5%' },
          ],
        },
        {
          id: 'view2',
          name: 'Lateral',
          touchs: [
            { id: 'touch1', x: '10%', y: '10%' },
            { id: 'touch2', x: '47%', y: '5%' },
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
