const authMiddleware = {
    protect: async (request, response, next) => {
        // can have mutiple middleware
        // next -> to move to next middleware or next actual request 
        try {
            const token = request.cookies?.jwtToken;
            if(!token){
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                request.user = user;
            }catch (error){
                return response.status(401).json({
                    error: 'Invalid or expired token'
                });
            }
        }catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal Server Error'
            });
        }
    },
}

// since cookie will be plain text so need to be converted to js object using cookie-parser package
// install cookie-parser package -> npm i cookie-parser in expense-server folder