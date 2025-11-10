import axios from 'axios';
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const clientGroupService={
    
    getAllClientGroups: async()=>{
        try {
            const response = await axios.get(`${VITE_BASE_URL}/ClientGroup/getallclientgroups`);
            return response.data;
        } catch (error) {
            console.error('Error fetching client groups:', error);
            throw error;
        }
    },
    createClientGroup: async(clientGroupData)=>{
        try {
            const response = await axios.post(`${VITE_BASE_URL}/ClientGroup/createclientgroup`, clientGroupData);
            return response.data;
        } catch (error) {
            console.error('Error creating client group:', error);
            throw error;
        }
    },
    updateClientGroup: async(clientGroupId, clientGroupData)=>{
        try {
            const response = await axios.put(`${VITE_BASE_URL}/ClientGroup/updateclientgroup/${clientGroupId}`, clientGroupData);
            return response.data;
        } catch (error) {
            console.error('Error updating client group:', error);
            throw error;
        }
    },
    deleteClientGroup: async(clientGroupId)=>{
        try {
            const response = await axios.delete(`${VITE_BASE_URL}/ClientGroup/deleteclientgroup/${clientGroupId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting client group:', error);
            throw error;
        }
    }
};
export default clientGroupService;