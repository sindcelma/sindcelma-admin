let socios = [
    {
        nome:'Lista',
        link:'/socios'
    },
    {
        nome:'Novo Sócio',
        link:'/socios/new'
    }
];

var submenus = {

    home:[],
    estatisticas:[],
    socios:socios,
    sorteios:[
        {
            nome:'Lista',
            link:'/sorteios'
        },
        {
            nome:'Novo Sorteio',
            link:'/sorteios/new'
        }
    ],
    cct:[
        {
            nome:'Lista',
            link:'/cct'
        },
        {
            nome:'Adicionar CCT',
            link:'/cct/new'
        },
    ]

}

export default {

    setSubmenu:(key:string, obj:{nome:string, link:string}) => {
        submenus[key].push(obj)
    },

    getSubmenu:(path:string):any[] => {
        const pathArr = path.split('/')
        const index = pathArr[1]
        return submenus[index] ? submenus[index] : [];
    }
}