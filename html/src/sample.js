let output={
    layers:{
        dense_0:{
            type:"Dense",
            outputs:[
                0.        , 1.7262673 , 4.626931  , 0.        , 5.049176  ,
                0.63255346, 0.        , 0.        , 5.451741  , 2.4955325 ,
                0.12426674, 0.        , 1.3954648 , 0.        , 0.        ,
                0.        , 0.        , 0.14377044, 0.        , 0.        ,
                0.        , 0.0776007 , 0.        , 3.0462267 , 0.48754492,
                0.        , 0.        , 0.32268086, 0.        , 0.        ,
                3.0594141 , 0.        , 1.2473191 , 0.        , 1.9197018 ,
                0.        , 0.        , 0.47572666, 2.248945  , 2.2196498 ,
                0.06026123, 0.        , 2.4518583 , 0.        , 0.        ,
                0.        , 0.        , 0.        , 7.8798914 , 0.        ,
                0.        , 1.5930952 , 1.1099558 , 0.        , 0.96895766,
                0.        , 1.314245  , 0.        , 0.        , 0.        ,
                0.2717786 , 0.        , 0.        , 0.        , 0.        ,
                0.0696864 , 0.        , 0.        , 0.        , 0.        ,
                0.        , 2.6985302 , 0.        , 0.        , 0.8378608 ,
                0.06050302, 0.        , 0.        , 0.        , 0.        ,
                0.6253454 , 0.        , 1.1650046 , 0.        , 0.        ,
                0.        , 1.6635857 , 0.23606242, 0.        , 0.        ,
                1.9018735 , 0.        , 0.        , 0.        , 0.        ,
                0.        , 0.        , 0.8635821 , 1.6088419 , 0.        ,
                0.        , 0.        , 0.        , 3.5326688 , 2.9223256 ,
                1.9584632 , 0.        , 0.        , 0.        , 0.        ,
                0.        , 0.        , 0.        , 0.        , 0.        ,
                0.        , 0.        , 0.        , 0.        , 0.        ,
                3.692366  , 0.8185444 , 0.        , 0.        , 0.        ,
                0.        , 0.        , 0.        
            ]
        },
        dense_1:{
            type:"Dense",
            outputs:[
                0.        , 0.        , 0.        , 0.        , 0.03535998,
                0.        , 3.1466205 , 0.        , 1.8026005 , 0.95320106,
                0.        , 0.        , 0.        , 0.        , 0.        ,
                5.5935054 , 7.052925  , 0.33435094, 0.        , 0.3790056 ,
                6.114813  , 4.8545594 , 0.        , 0.        , 1.0737407 ,
                4.159676  , 0.        , 0.        , 0.        , 6.001892  ,
                1.7321495 , 0.        , 0.        , 0.        , 0.        ,
                0.        , 0.        , 1.195508  , 0.5696373 , 0.        ,
                4.273031  , 1.4806533 , 3.1958077 , 2.3022943 , 3.0416758 ,
                0.        , 0.        , 0.        , 4.388562  , 0.        ,
                0.        , 0.        , 0.        , 0.        , 0.        ,
                0.7985923 , 0.        , 9.276779  , 1.4614391 , 0.        ,
                1.7211618 , 0.        , 0.        , 0.        
            ]
        },
        dense_2:{
            type:"Dense",
            outputs:[
                9.9984765e-01, 1.4781826e-09, 1.7235917e-07, 2.5942748e-10,
                2.9590984e-08, 7.8374924e-06, 3.6206359e-06, 1.3652866e-04,
                6.0496168e-09, 4.1701774e-06
            ]
        },
    },
    edges:{
        dense_0:"dense_1",
        dense_1:"dense_2"
    },
    network:[
        ["dense_0"],
        ["dense_1"],
        ["dense_2"]
    ]
}


export {output}

