let rowed_dense = {
    network: {
        input:{
            class_name:"InputLayer",
            outputs:[
                ['col 1',1],
                ['col 2',2],
                ['col 3',3],
                ['col 4',4],
                ['col 5',5],
            ],
            inbound:[],
            outbound:['out'],
            level:0,
            render_config:{
                type:'rowwithcolumn'
            }
        },
        out:{
            class_name:"Dense",
            outputs:[
                0.3,0.1,1
            ],
            inbound:['input'],
            outbound:[],
            level:1
        }
    },
    levels: [['input'],['out']],
    output: {
        out:'hello'
    },
    input: {
        input:{
            type:'row'
        }
    }
}

export { rowed_dense }