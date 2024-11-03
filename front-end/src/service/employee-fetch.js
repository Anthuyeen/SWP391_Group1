//viwe list
export const fetchUsers = async () => {
    try {
        const response = await fetch('https://localhost:7043/api/UserManagement/ViewListUser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.$values;
    } catch (error) {
        console.error('There was an error fetching the users:', error);
        return null;
    }
};
//post https://localhost:7043/api/UserManagement/AddExpert

export const addUser = async (userData) => {
    try {
        const response = await fetch('https://localhost:7043/api/UserManagement/AddExpert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`, // Nếu cần xác thực
            },
            body: JSON.stringify(userData), // Chuyển đổi dữ liệu người dùng thành chuỗi JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Trả về dữ liệu JSON từ API
    } catch (error) {
        console.error('There was an error adding the user:', error);
        return null; // Trả về null hoặc bạn có thể quyết định trả về một giá trị khác khi xảy ra lỗi
    }
};
//set activate
export const setActiveExpert = async (eid) => {
    const url = `https://localhost:7043/api/UserManagement/SetActiveExpert?eid=${eid}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to set active expert:', error);
        throw error;
    }
};

// add moderator
export const fetchAddModerator = async (moderatorData) => {
    try {
        const response = await fetch('https://localhost:7043/api/UserManagement/AddModerator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moderatorData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding moderator:', error);
        throw error;
    }
};

//list all moderator
export const fetchListAllModerators = async () => {
    try {
      const response = await fetch('https://localhost:7043/api/UserManagement/ListAllModerator', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result.$values;
    } catch (error) {
      console.error('Error fetching list of moderators:', error);
      throw error;
    }
  };
  
