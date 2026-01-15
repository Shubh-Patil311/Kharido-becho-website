// src/pages/Contact.jsx
import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: implement submit logic (API call or email handling)
    alert(`Thank you, ${form.name}! We’ll get back to you soon.`);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold mb-6">Contact Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-3">Get in Touch</h3>
          <p className="text-gray-700 mb-4">
            Whether you have questions, feedback or need support with listing your item—
            we’re here to help. Just drop us a message and we’ll respond as soon as possible.
          </p>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Email:</strong> support@kharidobhecho.com</li>
            <li><strong>Phone:</strong> +91-1234-567890</li>
            <li><strong>Address:</strong> Pimpri, Maharashtra, India</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Your email"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="5"
              placeholder="How can we help you?"
              required
            />
          </div>

          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
