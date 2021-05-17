import sys
import json

def build_table():
    import mysql.connector
    from mysql.connector import Error
    try:
        connection = mysql.connector.connect(host='127.0.0.1',
                                             database='test_db',
                                             user='root',
                                             password='root',
                                             auth_plugin='mysql_native_password')
        cursor = connection.cursor()
        
        # build tables
        # University
        sql1 = """CREATE TABLE University (
                University_Name VARCHAR(255) NOT NULL,
                Location VARCHAR(255),
                PRIMARY KEY (University_Name)
                )"""
        cursor.execute(sql1)
        connection.commit()
        
        # # User
        # sql2 = """CREATE TABLE User (
        #         User_email VARCHAR(255) NOT NULL,
        #         FirstName VARCHAR(255),
        #         LastName VARCHAR(255),
        #         University_Name VARCHAR(255),
        #         Course_ID VARCHAR(10),
        #         Location VARCHAR(255),
        #         Birthday DATE,
        #         PRIMARY KEY (User_email),
        #         FOREIGN KEY (University_Name) REFERENCES University(University_Name) ON DELETE CASCADE
        #         )"""
        # cursor.execute(sql2)
        # connection.commit()

        # # Course_Group
        # sql3 = """CREATE TABLE Course_Group (
        #         Course_ID VARCHAR(10) NOT NULL,
        #         Credit INT,
        #         Instructor VARCHAR(255),
        #         Department VARCHAR(255),
        #         PRIMARY KEY (Course_ID, Instructor)
        #         )"""
        # cursor.execute(sql3)
        # connection.commit()
        
        # # Course
        # sql4 = """CREATE TABLE Course (
        #         University_Name VARCHAR(255) NOT NULL,
        #         Course_ID VARCHAR(10) NOT NULL,
        #         Course_Name VARCHAR(255),
        #         PRIMARY KEY (University_Name, Course_ID),
        #         FOREIGN KEY (University_Name) REFERENCES University(University_Name) ON DELETE CASCADE,
        #         FOREIGN KEY (Course_ID) REFERENCES Course_Group(Course_ID) ON DELETE CASCADE
        #         )"""
        # cursor.execute(sql4)
        # connection.commit()

        # Enrollment
        sql5 = """CREATE TABLE Enrollment(
                University_Name VARCHAR(50),
                Department VARCHAR(50),
                Course_ID VARCHAR(50),
                Instructor VARCHAR(50),
                Course_Name VARCHAR(50),
                Student_name VARCHAR(50),
                Rating REAL,
                PRIMARY KEY(University_Name, Department, Course_ID, Student_name),
                FOREIGN KEY (University_Name) REFERENCES University(University_Name) ON DELETE CASCADE
                )"""
        cursor.execute(sql5)
        connection.commit()

        # Search
        # sql6 = """CREATE TABLE Search (
        #         University_Name VARCHAR(255),
        #         Department VARCHAR(50)
        #         )"""
        # cursor.execute(sql6)
        # connection.commit()

        # insert values into tables
        # insert into University
        data_uni = [
            ('UIUC', 'Champaign'),
            ('BC', 'Boston')
        ]
        sql7 = "INSERT INTO University VALUES (%s, %s)"
        cursor.executemany(sql7, data_uni)
        connection.commit()

        

        # insert into Enrollment
        data = [
            ("UIUC", "CS", "CS411", "Abdussalam Alawini","Database Systems", "Monica", 5.0),
            ("UIUC", "CS", "CS411", "Abdussalam Alawini","Database Systems",  "Lucas", 5.0),
            ("UIUC", "CS", "CS411", "Abdussalam Alawini","Database Systems",  "Francis", 4.8),
            ("UIUC", "CS", "CS225", "Graham Evans","Data Structures", "Miles", 3.0),
            ("UIUC", "CS", "CS225", "Graham Evans","Data Structures", "Emily", 5.0),
            ("UIUC", "CS", "CS225", "Graham Evans","Data Structures", "Oscar", 2.0),
            ("UIUC", "CS", "CS225", "Craig Zilles","Data Structures", "Potter", 5.0),
            ("UIUC", "CS", "CS225", "Craig Zilles","Data Structures", "Bobby", 4.0),
            ("UIUC", "CS", "CS225", "Craig Zilles","Data Structures", "Leo", 4.0),
            ("UIUC", "CS", "CS125", "Geoffrey Challen","Intro to Computer Science", "Norman", 5.0),
            ("UIUC", "CS", "CS125", "Geoffrey Challen","Intro to Computer Science", "Erickson", 3.0),
            ("UIUC", "CS", "CS125", "Geoffrey Challen","Intro to Computer Science", "Norris", 2.0),
            ('UIUC', 'STAT', 'STAT400', 'Albert Yu',"Statistics and Probability I", 'Kyle', 5.0),
            ('UIUC', 'STAT', 'STAT400', 'Albert Yu',"Statistics and Probability I", 'Tina', 5.0),
            ('UIUC', 'STAT', 'STAT400', 'Albert Yu',"Statistics and Probability I", 'Andy', 1.0),
            ('UIUC', 'STAT', 'STAT400', 'Uma Ravat',"Statistics and Probability I", 'Roberta', 4.0),
            ('UIUC', 'STAT', 'STAT400', 'Uma Ravat',"Statistics and Probability I", 'Rafi', 1.0),
            ('UIUC', 'STAT', 'STAT400', 'Uma Ravat',"Statistics and Probability I", 'Nikki', 3.0),
            ('UIUC', 'STAT', 'STAT448', 'Darren Glosemeyer',"Advanced Data Analysis", 'Hayden', 5.0),
            ('UIUC', 'STAT', 'STAT448', 'Darren Glosemeyer',"Advanced Data Analysis", 'Eduardo', 5.0),
            ('UIUC', 'STAT', 'STAT448', 'Darren Glosemeyer',"Advanced Data Analysis", 'Rodriguez', 4.8),
            ('UIUC', 'CS', 'CS374', 'Nickvash Kani',"Intro to Algs & Models of Comp", 'Kevin', 1.0),
            ('UIUC', 'CS', 'CS374', 'Nickvash Kani',"Intro to Algs & Models of Comp", 'Jason', 3.0),
            ('UIUC', 'CS', 'CS374', 'Nickvash Kani',"Intro to Algs & Models of Comp", 'Alpha', 3.0),
            ('UIUC', 'CS', 'CS101', 'Thomas Gambill',"Intro Computing: Engrg & Sci", 'Abraham', 5.0),
            ('UIUC', 'CS', 'CS101', 'Thomas Gambill',"Intro Computing: Engrg & Sci", 'Ariyah', 3.0),
            ('UIUC', 'CS', 'CS101', 'Thomas Gambill',"Intro Computing: Engrg & Sci", 'Dacia', 3.5),
            ('UIUC', 'CS', 'CS101', 'Thomas Gambill',"Intro Computing: Engrg & Sci", 'Yachel', 4.5),
            ('UIUC', 'ECE', 'ECE342', 'Nickvash Kani','Electronic Circuits', 'Andrew', 4.0),
            ('UIUC', 'ECE', 'ECE342', 'Nickvash Kani','Electronic Circuits', 'Abbot', 5.0),
            ('UIUC', 'ECE', 'ECE342', 'Nickvash Kani','Electronic Circuits', 'Susan', 4.0),
            ('UIUC', 'STAT', 'STAT410', 'Yun Yang','Statistics and Probability II', 'Carolina', 1.0),
            ('UIUC', 'STAT', 'STAT410', 'Yun Yang','Statistics and Probability II', 'Traci', 2.0),
            ('UIUC', 'STAT', 'STAT410', 'Yun Yang','Statistics and Probability II', 'Isabel', 4.0),
            ('UIUC', 'STAT', 'STAT410', 'Yun Yang','Statistics and Probability II', 'Helen', 2.0),
            ('UIUC', 'STAT', 'STAT385', 'James Balamuta','Statistics Programming Methods', 'Daisy', 4.0),
            ('UIUC', 'STAT', 'STAT385', 'James Balamuta','Statistics Programming Methods', 'Stella', 5.0),
            ('UIUC', 'STAT', 'STAT385', 'James Balamuta','Statistics Programming Methods', 'Linda', 4.0),
            ('UIUC', 'STAT', 'STAT385', 'James Balamuta','Statistics Programming Methods', 'Laura', 5.0),
            ('UIUC', 'STAT', 'STAT385', 'James Balamuta','Statistics Programming Methods', 'Jennifer', 5.0),
            ('BC', 'ECON', 'ECON201', 'Rasim Ozcan','Discussion Group/Principles of Economics', 'Vicki', 5.0),
            ('BC', 'ECON', 'ECON201', 'Rasim Ozcan','Discussion Group/Principles of Economics', 'Janent', 5.0),
            ('BC', 'ECON', 'ECON201', 'Rasim Ozcan','Discussion Group/Principles of Economics', 'Beverly', 4.0),
            ('BC', 'ECON', 'ECON201', 'Rasim Ozcan','Discussion Group/Principles of Economics', 'Ruth', 5.0),
            ('BC', 'ECON', 'ECON201', 'Rasim Ozcan','Discussion Group/Principles of Economics', 'Margaret', 4.0),
            ('BC', 'ECON', 'ECON100', 'Harold Petersen','Readings and Research', 'Lucille', 5.0),
            ('BC', 'ECON', 'ECON100', 'Harold Petersen','Readings and Research', 'Karen', 3.5),
            ('BC', 'ECON', 'ECON100', 'Harold Petersen','Readings and Research', 'Luisa', 1.5),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Amalia', 4.0),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Patricia', 4.5),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Odessa', 3.5),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Kimberly', 5.0),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Kayleigh', 4.0),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Phobe', 4.5),
            ('BC', 'PHILOSOPHY', 'PHIL1090', 'Brian Braman','Perspectives on Western Culture I', 'Tracy', 4.5),
            ('BC', 'PHILOSOPHY', 'PHIL1100', 'Alex Boston','Introduction to Philosophy', 'Mila', 2.0),
            ('BC', 'PHILOSOPHY', 'PHIL1100', 'Alex Boston','Introduction to Philosophy', 'Claudia', 2.0),
            ('BC', 'PHILOSOPHY', 'PHIL1100', 'Alex Boston','Introduction to Philosophy', 'Desiree', 1.0),
            ('BC', 'PHILOSOPHY', 'PHIL1100', 'Alex Boston','Introduction to Philosophy', 'Dorothy', 1.0),
            ('BC', 'PHILOSOPHY', 'PHIL1100', 'Alex Boston','Introduction to Philosophy', 'Brenda', 1.0)
        ]
        sql8 = "INSERT INTO Enrollment VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.executemany(sql8, data)
        connection.commit()

    except mysql.connector.Error as error:
        print("Failed to execute build table: {}".format(error))
    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()




def recommand(University_Name, Department):
    import mysql.connector
    from mysql.connector import Error

    # Stored Procedure One
    # select courses which have average ratings higher than the average rating for that department
    def select_high_rating():
        try:
            connection = mysql.connector.connect(host='127.0.0.1',
                                                 database='test_db',
                                                 user='root',
                                                 password='root',
                                                 auth_plugin='mysql_native_password')
            cursor = connection.cursor()
            # the sql syntax for stored procedure one
            sql1 = """CREATE PROCEDURE high_rating()
                    BEGIN
                        DECLARE done INT DEFAULT 0;
                        DECLARE curuniver VARCHAR(50);
                        DECLARE curdept VARCHAR(50);
                        DECLARE curcourse VARCHAR(50);
                        DECLARE curname VARCHAR(50);
                        DECLARE currating VARCHAR(50);
                        DECLARE curavg VARCHAR(50);
                        DECLARE cur CURSOR FOR SELECT University_Name, Department, Course_ID, Course_Name, AVG(Rating) FROM Enrollment GROUP BY University_Name, Department, Course_ID;
                        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
                        DROP TABLE IF EXISTS NewTable;
                    
                        CREATE TABLE NewTable(
                        University_Name VARCHAR(50),
                        Department VARCHAR(50),
                        Course_ID VARCHAR(50),
                        Course_Name VARCHAR(50),
                        Rating REAL,
                        PRIMARY KEY(University_Name, Department, Course_ID));
                        
                        OPEN cur;
                        REPEAT
                            FETCH cur INTO curuniver, curdept, curcourse, curname, currating;
                            SET curavg = (SELECT AVG(Rating) FROM Enrollment GROUP BY University_Name, Department HAVING University_Name = curuniver AND Department = curdept);
                            
                            IF currating >= curavg THEN 
                            INSERT IGNORE INTO NewTable
                            VALUES(curuniver, curdept, curcourse, curname, ROUND(currating, 2));
                            END IF;
                            
                        UNTIL done
                        END REPEAT;
                        CLOSE cur;
                        
                        SELECT University_Name, Department, Course_ID, Course_Name, Rating
                        FROM NewTable
                        ORDER BY Rating DESC;

                    END"""
            cursor.execute("DROP PROCEDURE IF EXISTS high_rating")
            connection.commit()
            cursor.execute(sql1)
            connection.commit()
            cursor.callproc('high_rating')
            connection.commit()

        except mysql.connector.Error as error:
            print("Failed to execute stored procedure one: {}".format(error))
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                

    # Stored Procedure Two
    # find the courses with high ratings which match the inserted conditions as recommandation
    def find_course():
        try:
            connection = mysql.connector.connect(host='127.0.0.1',
                                                 database='test_db',
                                                 user='root',
                                                 password='root',
                                                 auth_plugin='mysql_native_password')
            cursor = connection.cursor()
            # the sql syntax for stored procedure two
            sql1 = """CREATE PROCEDURE Find(
                    IN newuniver VARCHAR(50), newdept VARCHAR(50))
                        BEGIN
                            DECLARE done INT DEFAULT 0;
                            DECLARE curuniver VARCHAR(50);
                            DECLARE curdept VARCHAR(50);
                            DECLARE curcourse VARCHAR(50);
                            DECLARE curname VARCHAR(50);
                            DECLARE currating VARCHAR(50);
                            DECLARE cur CURSOR FOR SELECT n.University_Name, n.Department, n.Course_ID, n.Course_Name, n.Rating
                                                FROM NewTable n 
                                                ORDER BY n.Rating DESC;
                            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
                            DROP TABLE IF EXISTS Result;
                        
                            CREATE TABLE Result(
                            University_Name VARCHAR(50),
                            Department VARCHAR(50),
                            Course_ID VARCHAR(50),
                            Course_Name VARCHAR(50),
                            Rating REAL,
                            PRIMARY KEY(University_Name, Department, Course_ID));
                            
                            OPEN cur;
                            REPEAT
                                FETCH cur INTO curuniver, curdept, curcourse, curname, currating;
                                IF curuniver = newuniver AND curdept = newdept THEN        
                                INSERT IGNORE INTO Result
                                VALUES(curuniver, curdept, curcourse, curname, round(currating, 2));
                                END IF;
                                
                            UNTIL done
                            END REPEAT;
                            CLOSE cur;
                            
                            SELECT University_Name, Department, Course_ID, Course_Name, Rating
                            FROM Result
                            ORDER BY Rating DESC;
                            
                        END"""
            cursor.execute("DROP PROCEDURE IF EXISTS Find")
            connection.commit()
            cursor.execute(sql1)
            connection.commit()
            args = [University_Name, Department]
            cursor.callproc('Find', args)
            connection.commit()

            # get the results and put them into list
            res = []
            new_res = []
            for sr in cursor.stored_results():
                res.append(sr.fetchall())
            for i in range(len(res[0])):
                new_res.append(res[0][i])
                    
        except mysql.connector.Error as error:
            print("Failed to execute stored procedure two: {}".format(error))
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
        return(new_res)

    select_high_rating()
    r = find_course()
    res = []
    for i in r:
        a = ''
        for j in range(len(i[2])):
            if i[2][j] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']:
                break
            a += i[2][j]
        res.append(i[0] + '-' + a + ' ' + i[2][j:])

    print(json.dumps(res))
    return res

# build_table()
# print(recommand('UIUC', 'CS'))
# print(recommand('UIUC', 'STAT'))
# print(recommand('BC', 'PHILOSOPHY'))
# print(recommand('UIUC', 'ECE'))
# print(recommand('UIUC', 'PHILOSOPHY'))

if __name__ == '__main__':
    # Map command line arguments to function arguments.
    recommand(sys.argv[1], sys.argv[2])
