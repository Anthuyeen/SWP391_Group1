//List All Subject
export const fetchAllSubjects = async () => {
    const url = 'https://localhost:7043/api/Subject/ViewAllSubject/ViewAllSubject';

    try {
        const response = await fetch(url, {
            method: 'GET', // Sử dụng phương thức GET
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data; // Trả về dữ liệu nhận được
    } catch (error) {
        console.error('Failed to fetch subjects:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
}; 
// get subject by owner id
export const fetchSubjectsByOwner = async (ownerId) => {
    try {
      const response = await fetch(`https://localhost:7043/api/Subject/ViewSubjectsByOwner/ViewSubjectsByOwner/${ownerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching subjects: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch subjects by owner:', error);
      throw error;
    }
  };
  