import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8080';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);

  // Edit Tracking IDs
  const [editBookId, setEditBookId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editDonateId, setEditDonateId] = useState(null);

  // Book States
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookImage, setBookImage] = useState(null);

  // User States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Donation States
  const [donorName, setDonorName] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const [donateMessage, setDonateMessage] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const bookRes = await axios.get(`${API_BASE_URL}/book-service/api/v1/books`).catch(() => ({ data: [] }));
      const userRes = await axios.get(`${API_BASE_URL}/user-service/api/v1/users`).catch(() => ({ data: [] }));
      const donateRes = await axios.get(`${API_BASE_URL}/donate-service/api/v1/donations`).catch(() => ({ data: [] }));

      setBooks(bookRes.data);
      setUsers(userRes.data);
      setDonations(donateRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // --- BOOK ACTIONS ---
  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', bookTitle);
      formData.append('author', bookAuthor);
      formData.append('price', bookPrice);
      formData.append('isbn', bookIsbn);
      if (bookImage) {
        formData.append('image', bookImage);
      }

      if (editBookId) {
        await axios.put(`${API_BASE_URL}/book-service/api/v1/books/${editBookId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/book-service/api/v1/books`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetBookForm();
      fetchAllData();
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  const editBook = (b) => {
    setEditBookId(b.id);
    setBookTitle(b.title);
    setBookAuthor(b.author);
    setBookPrice(b.price);
    setBookIsbn(b.isbn);
  };

  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`${API_BASE_URL}/book-service/api/v1/books/${id}`);
        fetchAllData();
      } catch (err) {
        console.error("Error deleting book:", err);
      }
    }
  };

  const resetBookForm = () => {
    setBookTitle('');
    setBookAuthor('');
    setBookPrice('');
    setBookIsbn('');
    setBookImage(null);
    setEditBookId(null);
  };

  // --- USER ACTIONS ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await axios.put(`${API_BASE_URL}/user-service/api/v1/users/${editUserId}`, {
          name: userName,
          email: userEmail
        });
      } else {
        await axios.post(`${API_BASE_URL}/user-service/api/v1/users`, {
          name: userName,
          email: userEmail
        });
      }
      setUserName('');
      setUserEmail('');
      setEditUserId(null);
      fetchAllData();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const editUser = (u) => {
    setEditUserId(u.id);
    setUserName(u.name);
    setUserEmail(u.email);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/user-service/api/v1/users/${id}`);
        fetchAllData();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  // --- DONATION ACTIONS ---
  const handleSaveDonate = async (e) => {
    e.preventDefault();
    try {
      const donateData = {
        donorName: donorName,
        amount: parseFloat(donateAmount),
        message: donateMessage
      };

      if (editDonateId) {
        await axios.put(`${API_BASE_URL}/donate-service/api/v1/donations/${editDonateId}`, donateData);
      } else {
        await axios.post(`${API_BASE_URL}/donate-service/api/v1/donations`, donateData);
      }
      setDonorName('');
      setDonateAmount('');
      setDonateMessage('');
      setEditDonateId(null);
      fetchAllData();
    } catch (err) {
      console.error("Error saving donation:", err);
    }
  };

  const editDonation = (d) => {
    setEditDonateId(d.id);
    setDonorName(d.donorName);
    setDonateAmount(d.amount);
    setDonateMessage(d.message || '');
  };

  const deleteDonation = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await axios.delete(`${API_BASE_URL}/donate-service/api/v1/donations/${id}`);
        fetchAllData();
      } catch (err) {
        console.error("Error deleting donation:", err);
      }
    }
  };

  return (
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-brand">📚 Library Manager</div>
          <ul className="sidebar-menu">
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard
            </li>
            <li className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
              📖 Books Section
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              👤 Users Section
            </li>
            <li className={activeTab === 'donate' ? 'active' : ''} onClick={() => setActiveTab('donate')}>
              💰 Donations Section
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="header">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : `${activeTab.toUpperCase()} MANAGEMENT`}
          </div>

          <div className="content-body">
            {activeTab === 'dashboard' && (
                <div>
                  <h2>System Analytics</h2>
                  <div className="card-grid">
                    <div className="stat-card books">
                      <h3>Total Books</h3>
                      <p>{books.length}</p>
                    </div>
                    <div className="stat-card users">
                      <h3>Total Users</h3>
                      <p>{users.length}</p>
                    </div>
                    <div className="stat-card donate">
                      <h3>Total Donations</h3>
                      <p>{donations.length}</p>
                    </div>
                  </div>
                </div>
            )}

            {/* BOOKS SECTION */}
            {activeTab === 'books' && (
                <div>
                  <h2>Manage Books</h2>
                  <div className="form-container" style={{ display: 'block' }}>
                    <form onSubmit={handleSaveBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%' }}>
                      <input
                          type="text"
                          placeholder="Book Title..."
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          required
                      />
                      <input
                          type="text"
                          placeholder="Author Name..."
                          value={bookAuthor}
                          onChange={(e) => setBookAuthor(e.target.value)}
                          required
                      />
                      <input
                          type="number"
                          step="0.01"
                          placeholder="Price ($)..."
                          value={bookPrice}
                          onChange={(e) => setBookPrice(e.target.value)}
                          required
                      />
                      <input
                          type="text"
                          placeholder="ISBN Number..."
                          value={bookIsbn}
                          onChange={(e) => setBookIsbn(e.target.value)}
                          required
                      />
                      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Book Cover Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBookImage(e.target.files[0])}
                            style={{ border: 'none', padding: '6px 0' }}
                        />
                      </div>
                      <button type="submit" style={{ gridColumn: 'span 2' }}>
                        {editBookId ? 'Update Book' : 'Add New Book'}
                      </button>
                    </form>
                  </div>

                  <table>
                    <thead>
                    <tr>
                      <th># ID</th>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Price</th>
                      <th>ISBN</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.length > 0 ? books.map((b, idx) => (
                        <tr key={b.id || idx}>
                          <td>{b.id || idx+1}</td>
                          <td>
                            {b.coverImageUrl ? (
                                <img src={b.coverImageUrl} alt="Cover" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '12px' }}>No Image</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{b.title}</td>
                          <td>{b.author}</td>
                          <td>$ {b.price}</td>
                          <td>{b.isbn}</td>
                          <td>
                            <button onClick={() => editBook(b)} style={{ marginRight: '8px', background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => deleteBook(b.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                          </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8' }}>No books found</td></tr>
                    )}
                    </tbody>
                  </table>
                </div>
            )}

            {/* USERS SECTION */}
            {activeTab === 'users' && (
                <div>
                  <h2>Manage Users</h2>
                  <div className="form-container" style={{ display: 'block' }}>
                    <form onSubmit={handleSaveUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', width: '100%', alignItems: 'center' }}>
                      <input
                          type="text"
                          placeholder="Enter User Name..."
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                      />
                      <input
                          type="email"
                          placeholder="Enter User Email..."
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          required
                      />
                      <button type="submit">{editUserId ? 'Update User' : 'Add User'}</button>
                    </form>
                  </div>
                  <table>
                    <thead>
                    <tr>
                      <th># ID</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? users.map((u, idx) => (
                        <tr key={u.id || idx}>
                          <td>{u.id || idx+1}</td>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <button onClick={() => editUser(u)} style={{ marginRight: '8px', background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => deleteUser(u.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                          </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>No users found</td></tr>
                    )}
                    </tbody>
                  </table>
                </div>
            )}

            {/* DONATIONS SECTION */}
            {activeTab === 'donate' && (
                <div>
                  <h2>Manage Donations</h2>
                  <div className="form-container" style={{ display: 'block' }}>
                    <form onSubmit={handleSaveDonate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '12px', width: '100%', alignItems: 'center' }}>
                      <input
                          type="text"
                          placeholder="Donor Name..."
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          required
                      />
                      <input
                          type="number"
                          step="0.01"
                          placeholder="Amount ($)..."
                          value={donateAmount}
                          onChange={(e) => setDonateAmount(e.target.value)}
                          required
                      />
                      <input
                          type="text"
                          placeholder="Message (Optional)..."
                          value={donateMessage}
                          onChange={(e) => setDonateMessage(e.target.value)}
                      />
                      <button type="submit">{editDonateId ? 'Update Donation' : 'Donate Now'}</button>
                    </form>
                  </div>

                  <table>
                    <thead>
                    <tr>
                      <th># ID</th>
                      <th>Donor Name</th>
                      <th>Amount</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {donations.length > 0 ? donations.map((d, idx) => (
                        <tr key={d.id || idx}>
                          <td>{d.id || idx+1}</td>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{d.donorName}</td>
                          <td>$ {d.amount}</td>
                          <td>{d.message || 'No message'}</td>
                          <td>
                            <button onClick={() => editDonation(d)} style={{ marginRight: '8px', background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => deleteDonation(d.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                          </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No donations found</td></tr>
                    )}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default App;