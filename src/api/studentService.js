const API_URL = "/api/students";

export const fetchStudents = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch students");
        return await response.json();
    } catch (error) {
        console.error("Error in fetchStudents:", error);
        throw error;
    }
};

export const fetchStudentById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch student details");
        return await response.json();
    } catch (error) {
        console.error("Error in fetchStudentById:", error);
        throw error;
    }
};

export const saveStudent = async (studentData, photoFile = null, existingId = null) => {
    try {
        const formData = new FormData();
        Object.entries(studentData).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (photoFile) {
            formData.append("photo", photoFile);
        }

        const url = existingId ? `${API_URL}/${existingId}` : API_URL;
        const method = existingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save student: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error saving student:", error);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete student");
        return await response.json();
    } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
};
