const permissions = require("../utility/permissions");

const authorize = (requiredPermission) => {
    return (request, response, next) => {
        const user = request.user;

        // DEBUG: Log authorization check
        console.log('🔐 Authorization Check:', {
            email: user?.email,
            role: user?.role,
            requiredPermission,
            userPermissions: permissions[user?.role] || [],
            hasPermission: (permissions[user?.role] || []).includes(requiredPermission)
        });

        if (!user) {
            console.log('❌ No user in request');
            return response.status(401).json({
                message: "Unauthorized access"
            });
        }

        const userPermissions = permissions[user.role] || [];

        if (!userPermissions.includes(requiredPermission)) {
            console.log('❌ Permission denied:', {
                userRole: user.role,
                userPermissions,
                required: requiredPermission
            });
            return response.status(403).json({
                message: "Forbidden: Insufficient Permissions"
            });
        }

        console.log('✅ Permission granted');
        next();
    };
};

module.exports = authorize;
