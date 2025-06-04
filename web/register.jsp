<%-- 
    ...existing code...
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Register</title>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <link href="css/style.css" rel="stylesheet" type="text/css"/>
        <style>
            .error-message {
                color: red;
                font-weight: bold;
                margin-bottom: 15px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div id="login">
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12">
                            <form id="login-form" class="form" action="register" method="post">
                                <h3 class="text-center text-info">Register</h3>
                                
                                <!-- Display Error Message -->
                                <% if(request.getAttribute("errorMessage") != null) { %>
                                <div class="error-message">
                                    <%= request.getAttribute("errorMessage") %>
                                </div>
                                <% } %>
                                
                                <div class="form-group">
                                    <label for="username" class="text-info">Username:</label><br>
                                    <input type="text" name="username" id="username" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-info">Password:</label><br>
                                    <input type="password" name="password" id="password" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="repassword" class="text-info">Re-Password:</label><br>
                                    <input type="password" name="repassword" id="repassword" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="email" class="text-info">Email:</label><br>
                                    <input type="email" name="email" id="email" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <input type="submit" name="submit" class="btn btn-info btn-md" value="Register">
                                </div>
                                <div id="register-link" class="text-right">
                                    <a href="login.jsp" class="text-info">Login here</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
