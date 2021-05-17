from random import randrange

universities = ['University of Illinois--Urbana-Champaign', 'Princeton University', 'Massachusetts Institute of Technology']
courses = ['CS', 'MATH', 'PHYS']
departments = ['Computer Science', 'Math', 'Physics']

# for i in range(100):
#     for j in range(randrange(5, 10)):
#         print(str(i) + '---', course[randrange(0, 2)], randrange(100, 600))
#     print()
#  await query('insert into Course(University_Name, course, department, term, instructor) values("University of Illinois--Urbana-Champaign", "CS411", "CS", "Fall 2020", "Abudu");');

for i in universities:
    for j in range(3):
        for k in range(10):
            a = str(randrange(100, 600))
            b = str(j * 10 + randrange(0, 8))
            print('await query(\'insert into Course(University_Name, course, department, term, instructor) values("'+i+'", "'+courses[j]+' '+a+'", "'+courses[j]+'", "Fall 2020", "Professor '+b+'");\');')