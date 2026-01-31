/**
 * MONGO DB
 * No SQL database
 * stores data as JSON and BSON (Binary JSON)
 * no strict schema or structure so we need to handle carefully
 * 
 * stores in tree like structure
 * 
 * eg. when we dont have money we can buy course by permission of family friends (SQL) but when we have money we can buy course on our own(NO SQL)
 * 
 * AWS DynamoDB is a No SQL database and distributed database across multiple servers, and expensive for even (select *)
 * 
 * //////////////////////////////////////////////////////////////
 * 
 * how data is stored
 * 
 * users
 * -------
 * id
 * name
 * email
 * password
 * ------------------------------------------------
 * 
 * embedding                    Normalization
 * 
 * shoud we use embedding (orderid , orderName)in users collection for expenses or create separate expenses collection
 * 
 * it will be like a map
 * 
 *  users
 * -------
 * id
 * name
 * email
 * password
 * orders
 *     - orderID
 *     - orderName
 * 
 * ////////////// now should order be in seperate table or inside users table /////////////////
 * every row in nosql has a size limit of 16mb so if we keep adding orders in users table it will exceed limit
 * so better to create separate expenses collection
 * butt we can use embedding for small data even redundancy is ok
 * main priority is retrival speed
 * if its growing data better to keep in separate collection
 * 
 * when we have to gather data from multiple places its expensive in SQL and even more expensive in NOSQL, so we need to design very efficiently the spread of data
 * MOngoDB stores datta in fpor of document -> (JSON) but behind the seen stores in BSON (JSON+metaadata)
 * Document stores on disk, Indexes - when selected on name index all the names will be structured in Btree - log(n)
 * Tommy ---->  Address (log(n)) constant time to get the address
 * Collection -  a group of similar type of data
 * eg. users
 *     ------
 *      - id
 *      - email
 *      - name
 *      - age
 * goal : collection as minimal as possible as very expensive
 * 
 * 
 *   users
 * -------
 * id        - 1
 * name      - John
 * email     - John@gmail.com
 * password  - John123
 * orders    
 *     - orderID     - 3
 *     - orderName   - phone
 * 
 * its growing data so move orders to different collection 
 * 
 * /////////////////////////////////////////////////////////////////////////////////
 * 
 * in expense-server cli npm install mongoose- lib to easy interaction with mongodb
 * ability to create schemas models
 * 
 * create model folder under src and User.js
 * 
 * ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 * 
 * HTTP
 * Hyper text transfer protocol
 * request needs to travel to the server and reverse too, and to execute it thers some protocol thats HTTP over the internet , to talk to server
 * protocols is set of rules
 * HTTP is lowest level protocol
 * 
 * how does a browser knows its  a success response or failed response (understanding the data)
 * Google has different Facebook has different but we need a common playground
 * 
 * so HTTP has 
 *  response code represents
 * 2xx - success    (200, 201, 202 .....)
 * 3xx - redirection
 * 4xx - client error
 * 5xx - server error
 * 
 * say if we want user to retry refreshing the page and taht can be done by our side and this comes from 5xx
 * password error - 4xx its a client side error
 * 
 * used to communicate between two services
 * has request response cycle
 * 
 * user -------------------> server
 *        HTTP request (GET) - whenever reading data from server
 *                      (POST) - whenever sending data to server like form submission
 *                      (PATCH) - whenever partial updating data on server
 *                      (PUT)  - whenever updating data on server, combination of POST and PATCH
 *                      (DELETE) - whenever deleting data on server
 *        http://ipaddress:port/resourcePath
 * <--------------------------
 *        response codes(2xx/ 5xx)
 * 
 * params and body - data can be sent via url params or request body
 * 
 * every response from server must have a common HTTP response code
 * HTTP codes-
 * 2xx - OK
 * 4xx - client error   (we must not retry as developer its client side error)
 * 5xx - server error  (as a developer we must retry by our side)
 * 
 * 
 * 
 * /////////////////////////////////////////////////////////////////////////////////////////////
 * 
 * REST API
 * Representational state transfer
 * rest makes use of http underline protocol to transfer data between two services
 * REST is like entire resturant : unlike HTTP instead of hiring waiters for our orders to transfer to kitchen 
 * we have a menu card (API doc) which has all the details of what is available in kitchen (server)
 * .
 * 
 * 
 * // steps for creating REST API 
 * create a folder named expense-server
 * cd expense-server
 * npm init -y (to create package.json file - metadata of project) -add custom scripts like start, we have projects' version, dependencies etc
 * 
 * // affliate link management
 * // personal expense management system
 * projects for WinterPEP
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * //
 * //////////////////////////////////////////////////////////////////////////////////////////////////////////FRONTEND
 * 
 * 
 * <head>
 * responsible for SEO
 * 
 * header ()
 * --------
 * secondary header(hero) / crouser section which you want users to see featured products
 * -------------------------------
 * 
 * 
 * 
 * 
 * 
 * cookies takes  ram and stores and prevent users from frequent login headache 
 * ------------------------------------------]
 * 
 * 
 * 
 * 
 * earlier it take much loading time to load a page on browse from server
 * now React injects itself in the DOM and creates its own DOM from second time and compares from the actual dom whatever changed will be replaced saving tons of time and no loading symbols
 *   
 * REACT
 * - single page JS framework
 * - Reusable components(combination of different html tags)
 * - output is also a JS
 * - offers adevelopment server(whenever changes made it compares and swaps the changes)
 * 
 * 
 * 
 * OAUth 2.0 protocol
 * first Authorization is done then aur=thentication, google needs to make sure that your data being passed to third party app is a reliable party 
 * 
 * Browser                    expense-react-client                           google OAuth                   expense-server                    MongoDB
 * ----continue with google--------->|--------Redirect with client ID------------>|
 *    |<------------------Login to google-----------------------------------------|
 *    |-------------------Login to google account-------------------------------->|
 *    |<--------------------Consent screen(authorization)-------------------------|
 *    |----------------------Conscent given-------------------------------------->|
 *                                   |<---------Token-----------------------------|
 *                                   |------------------------------/auth/google-sso----------------------------->|
 *                                                                                |<---------verify token---------|
 *                                                                                |---------user info ----------->|----------put operation------>|
 *                                                                                                                |<-----------------------------|
 *  
 * 
 */