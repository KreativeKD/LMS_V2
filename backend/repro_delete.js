
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function run() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin@admin',
            password: 'adminpassword123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('Logged in.');

        // 2. Create Course
        console.log('Creating course...');
        const courseRes = await axios.post(`${API_URL}/courses`, {
            title: 'Test Course for Delete',
            description: 'Testing delete chapter'
        }, { headers });
        const courseId = courseRes.data._id;
        console.log('Course created:', courseId);

        // 3. Add Chapter
        console.log('Adding chapter...');
        const chapterRes = await axios.post(`${API_URL}/courses/${courseId}/chapters`, {
            title: 'Test Chapter'
        }, { headers });
        const chapterId = chapterRes.data._id;
        console.log('Chapter added:', chapterId);

        // 4. Delete Chapter
        console.log('Deleting chapter...');
        try {
            await axios.delete(`${API_URL}/courses/chapters/${chapterId}`, { headers });
            console.log('Chapter deleted successfully via API.');
        } catch (error) {
            console.error('Failed to delete chapter via API:', error.response ? error.response.data : error.message);
        }

        // Cleanup: Delete Course
        await axios.delete(`${API_URL}/courses/${courseId}`, { headers });
        console.log('Cleanup complete.');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

run();
