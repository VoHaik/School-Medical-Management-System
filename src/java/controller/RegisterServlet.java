// ...existing code...

protected void processRequest(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    // ...existing code...
    
    // Get registration information
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String re_pass = request.getParameter("repassword");
    String email = request.getParameter("email");
    
    // Validation checks
    if (!password.equals(re_pass)) {
        request.setAttribute("errorMessage", "Passwords do not match!");
        request.getRequestDispatcher("register.jsp").forward(request, response);
        return;
    }
    
    // Check if username already exists
    AccountDAO dao = new AccountDAO();
    Account a = dao.checkAccountExist(username);
    if (a != null) {
        request.setAttribute("errorMessage", "Username already exists!");
        request.getRequestDispatcher("register.jsp").forward(request, response);
        return;
    }
    
    // Check email format
    if (!isValidEmail(email)) {
        request.setAttribute("errorMessage", "Invalid email format!");
        request.getRequestDispatcher("register.jsp").forward(request, response);
        return;
    }
    
    // If all checks pass, create new account
    dao.register(username, password, email);
    request.getRequestDispatcher("login.jsp").forward(request, response);
}

// Helper method to validate email
private boolean isValidEmail(String email) {
    String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
    Pattern pattern = Pattern.compile(emailRegex);
    return pattern.matcher(email).matches();
}

// ...existing code...
