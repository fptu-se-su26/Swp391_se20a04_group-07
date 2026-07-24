package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBContext {

    protected Connection connection;

    // Sửa getConnection() - trả về connection thật thay vì throw exception
    public static Connection getConnection() {
        try {
            String url = "jdbc:sqlserver://localhost:1433;"
                       + "databaseName=SchoolBusSystem;"
                       + "encrypt=false;"
                       + "sendStringParametersAsUnicode=true;"; // ✅ Fix tiếng Việt
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            return DriverManager.getConnection(url, "sa", "sa");
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public DBContext() {
        try {
            String url = "jdbc:sqlserver://localhost:1433;"
                       + "databaseName=SchoolBusSystem;"
                       + "encrypt=false;"
                       + "sendStringParametersAsUnicode=true;"; // ✅ Fix tiếng Việt
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            connection = DriverManager.getConnection(url, "sa", "sa");
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace();
        }
    }
}