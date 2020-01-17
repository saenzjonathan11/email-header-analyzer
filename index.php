   <?php
      ini_set('display_errors', 'On');
      define('ROOT', dirname(__FILE__).'/');
   ?>
<!DOCTYPE html>
<html>
   <head>
      <!-- <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> -->
      <title>Email Header Analyzer</title>
      <link rel="stylesheet" type="text/css" href="/css/styles.css">
   </head>

   <body>
      <div class="wrapper">
         <div class="middle-row">
            <div class="left-column">
            </div>
            <div class="middle-column">
               <div class="text-center">
                  <div class="maintitle">
                     <h1> Email Header Analysis </h1>
                  </div>
                  <div class="example">
                     <a target="_blank" href="https://docs.google.com/document/d/1h0iHijSztQwomQJyhlI8VT-qlmwdfyeqy16LWLVe9VQ/edit?usp=sharing">Get Header Example Here</a>
                     <p> On this subdomain, SSL encryption is disabled because of cross origin policy conflict with free APIs being used</p>
                  </div>
                  <table class="texttoparse">
                     <tbody>
                        <tr>
                           <th>Paste Email Header Below</th>
                        </tr>
                        <tr>
                           <td>
                              <p class="text-centerarea">
                                 <textarea id="textToParse" cols="80" rows="10"></textarea>
                              </p>
                           </td>
                        </tr>
                        <tr>
                           <td>
                              <p class="text-centerarea">
                                 <input type = "button" onclick = "parse();" name = "ok" value="Submit Header For Analysis" />
                              </p>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
            <div class="right-column">
            </div>
         </div>
      </div>
         <div id="dataTable"></div>
      </div>

      <!-- <div class="images">
         <img src="http://assets.ipapi.com/flags/sg.svg">
      </div> -->

      <script src = "/js/parseScript.js" type = "text/javascript"></script>
      <script async defer
         src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBwFJUHMlRliNKoA1bT9BV8CRr2l_A9DR8&callback=initMap">
      </script>
   </body>

</html>