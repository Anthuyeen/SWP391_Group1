//get all expert
export const fetchAllExperts = async () => {
    try {
        const response = await fetch('https://localhost:7043/api/UserManagement/ListAllExperts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Nếu API yêu cầu token xác thực thì thêm dòng dưới:
                // 'Authorization': `Bearer ${yourToken}`,
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // parse JSON từ phản hồi
        return data.$values;
    } catch (error) {
        console.error('Error fetching experts:', error);
        throw error; // Ném lỗi nếu cần xử lý ở nơi khác
    }
};
//get expert by id
export const fetchExpertById = async (id) => {
    try {
      const response = await fetch(`https://localhost:7043/api/UserManagement/GetExpertById/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching expert by id:', error);
      throw error;
    }
  };
  