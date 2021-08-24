const ApplicationContext = require("../../shared/config/ApplicationContext.js");

const App = function (props) {
  // Use minified build for 'hyperion.autodesk.io' so we get analytics data.
  const viewer3dJs =
    ApplicationContext.env === "prod" ? "viewer3D.min.js" : "viewer3D.js";
  const bannerImage = `${ApplicationContext.assetUrlPrefix}/assets/banner-home.png`;

  return `<html>
    <head>
        <meta charSet="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=no"
        />
        <meta property="og:title" content="hyperion.io" />
        <meta property="og:image" content="${bannerImage}" />
        <title>${props.title}</title>
        <link rel="stylesheet" href="${ApplicationContext.lmvUrl}/style.css" />
        <link rel="stylesheet" href="${
          ApplicationContext.assetRoot
        }/dist/main.bundle.css" />
        <script src="${ApplicationContext.lmvUrl}/${viewer3dJs}" ></script>

        <script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous"></script>
        <script src="https://use.fontawesome.com/4ebd942119.js"></script>


        <link rel="icon" type="image/png" href="https://www.autodesk.com/favicon.ico" />
        
        <style>
            .d-none{
                display: none!important;
            } 
            .d-block{
                display: block!important;
            }
            #property_info_container{
                background: #333;
                padding:.8rem; 
                position: fixed; 
                left: 15px; 
                top: 60%; 
                border-radius: 1rem;
                color: white; 
                z-index: 1000000000000000;
                font-size: .75rem;
            }
            .property_info h3{
                line-height: 1;
                margin: 0 0 8px 0;
            }
            .property_info .list-info{
               display: block;
               margin: 5px 0;
            }
            .property_info .list-info > span{
                margin-right: .3rem;
            }
        </style>
    </head>
    <body>
        <div id="hyperion_container">
            <script>
                var __app = __app || {};
                __app.dataContext = ${JSON.stringify(props.appData)};
            </script>
            <script src="${
              ApplicationContext.assetRoot
            }/dist/bundle.js" async ></script>
        </div>
        
        <div>
            <div id="property_info_container" class="d-none">
                <div id="temperature_info" class="property_info">
                    <h3>temperature_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>
                </div> 
                <div id="humidity_info" class="d-none property_info">
                    <h3>humidity_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>                </div>    
                <div id="co2_info" class="d-none property_info">
                    <h3>co2_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>
                </div>   
                <div id="illumination_info" class="d-none property_info">
                    <h3>illumination_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>
                </div>    
                <div id="tvoc_info" class="d-none property_info">
                    <h3>tvoc_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>        
                </div>                
                <div id="pmv_info" class="d-none property_info">
                    <h3>pmv_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>       
                </div>                
                <div id="ppd_info" class="d-none property_info">
                    <h3>ppd_info</h3>
                    <div>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                        <span class="list-info"><span>23-24:</span><span>Cold</span></span>
                    </div>        
                </div>
        </div>
        </div>
    </body>
</html>`;
};

module.exports = App;
