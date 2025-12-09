import { Student } from "../Student";


export class StudentManager {
    private students: Student[] = [];


    addStudent(student: Student): void {
        this.students.push(student);
        this.saveToLocalStorage();
        console.log('Saved students:', localStorage.getItem("students"));
    }


    getAllStudents(): Student[] {
        return this.students;
    }


    findStudentByID(id: string): Student | undefined {
        return this.students.find(s => s.id === id);
    }


    findStudentsByName(name: string): Student[] {
        return this.students.filter(s =>
            s.title_name.toLowerCase().includes(name.toLowerCase())
        );
    }


    findStudentsByMajor(major: string): Student[] {
        return this.students.filter(s =>
            s.major.toLowerCase().includes(major.toLowerCase())
        );
    }


    saveToLocalStorage(): void {
        localStorage.setItem("students", JSON.stringify(this.students));
    }


    loadFromLocalStorage(): void {
        const data = localStorage.getItem("students");
        console.log('Loaded students:', data);
        if (data) {
            this.students = JSON.parse(data);
        }
    }

    findStudentByEmail (email: string): Student | undefined {
        return this.students.find(s => s.email === email);
    }
}


