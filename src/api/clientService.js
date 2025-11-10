import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const clientService={

    getAllClients: async (name = '') => {
    try {
        const response = await axios.get(`${VITE_BASE_URL}/Client/getallclients`, {
            params: { name } // query parametri
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
},

    createClient: async(clientData)=>{
        try {
            const response = await axios.post(`${VITE_BASE_URL}/Client/create-client`, clientData);
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },
    updateClient: async (clientId, clientData) => {
    try {
        const payload = {
            id: clientId,
            ...clientData
        };
        const response = await axios.put(`${VITE_BASE_URL}/Client/update-client`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
},

    deleteClient: async(clientId)=>{
        try {
            const response = await axios.delete(`${VITE_BASE_URL}/Client/delete-client/${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    },
    deleteMultipleClients: async(clientIds)=>{
        try {
            const response = await axios.delete(`${VITE_BASE_URL}/Client/delete-multipleclients`, { 
                data: clientIds 
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting multiple clients:', error);
            throw error;
        }
    }

}
export default clientService;