const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware si server-ku u fahmo xogta JSON-ka ah
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

// Endpoint-ka helaya xogta foomka
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Fadlan buuxi dhammaan meelaha muhiimka ah.' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        phone: phone || 'N/A',
        message,
        date: new Date().toISOString()
    };

    const filePath = path.join(__dirname, 'messages.json');

    // Akhrinta ama kaydinta fariimaha
    fs.readFile(filePath, 'utf8', (err, data) => {
        let messages = [];
        if (!err && data) {
            try { 
                messages = JSON.parse(data); 
            } catch (e) { 
                messages = []; 
            }
        }
        
        messages.push(newMessage);

        fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Cillad ayaa ka dhacday kaydinta xogta.' });
            }
            return res.status(200).json({ success: true, message: 'Mahadsanid! Fariintaada waa la helay.' });
        });
    });
});

// Bilaabida Server-ka
app.listen(PORT, () => {
    console.log(`Server-ku wuxuu ka shaqaynayaa: http://localhost:${PORT}`);
});