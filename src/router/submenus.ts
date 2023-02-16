const submenus = {

    home:[],
    estatisticas:[],
    socios:[
        {
            nome:'Lista',
            link:'/socios'
        },
        {
            nome:'Novo Sócio',
            link:'/socios/new'
        }
    ],
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
    getSubmenu:(path:string):any[] => {
        const pathArr = path.split('/')
        const index = pathArr[1]
        return submenus[index] ? submenus[index] : [];
    }
}