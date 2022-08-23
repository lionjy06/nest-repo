const schema = {
   "document": {
     "primarySectionName": "docid",
     "sections": [
      {
         "name":"docid"
      },
      {
        "docProperties": [
          {
            "type": "string",
            "name": "dp_brand"
          }
        ],
        "name": "brand"
      },
      {
        "docProperties": [
          {
            "type": "string",
            "name": "dp_name"
          }
        ],
        "name": "name"
      },
      {
        "docProperties": [
          {
            "type": "string",
            "name": "dp_color"
          }
        ],
        "name": "color"
      },
      {
        "docProperties": [
          {
            "type": "int16",
            "name": "dp_price"
          }
        ],
        "name": "price"
      },
      {
         "name":"type"
      },
     ],
     "indexes": [
       {
         "documentTermWeight": "sum_wgt",
         "buildInfos": [
           {
             "sections": [
               "name",
               "brand",
               "price",
               "color",
               "type"
             ],
             "sectionTermWeight": "1.0 * stw_2p(tf, 0.5, 0.25, 0., length / 128.0)",
             "indexProcessors": [
               {
                 "type": "hanaterm",
                 "method": "sgmt",
                 "option": "+korea +josacat +eomicat"
               }
             ],
             "name": "index_build_0"
           }
         ],
         "name": "content_indexer"
       }
     ]
   }
 }

export default schema