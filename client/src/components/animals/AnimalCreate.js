// frontend/src/components/GoatCreate.js

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from '../context/UserContext';

export default function GoatCreate() {
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [image, setImage] = useState(null);
  const [type, setType] = useState('Purchased'); // default value
  const [age, setAge] = useState('');

  const navigate = useNavigate();
  const { token } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('cost', cost);
    formData.append('purchase_date', purchaseDate);
    formData.append('type', type);
    formData.append('age', age);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/animals`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/dashboard/animalslist');
    } catch (err) {
      console.error('Error creating goat:', err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/animalslist');
  };

  return (
    <div className="card col-md-8 mx-auto">
      <div className="card-header">
        <h2 className="text-center">Add New Animal / نیا جانور یہاں پر جمع کریں</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Description */}
          <div className="mb-3">
            <label><b>Description / تفصیل</b></label>
            <input
              type="text"
              className="form-control"
              placeholder="یہاں پر جانور کے بارے میں تفصیل لکھیں۔۔۔"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Cost */}
          <div className="mb-3">
            <label><b>Cost / رقم</b></label>
            <input
              type="text"
              className="form-control"
              placeholder="یہاں پر رقم کا اندراج کریں۔"
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>

           {/* Age */}
           <div className="mb-3">
            <label><b>Age / Date of Birth</b></label>
            <input
              type="text"
              className="form-control"
              placeholder="تاریخ پیدایش درج کریں۔"
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Purchase Date */}
          <div className="mb-3">
            <label><b>Purchase Date / خریداری کی تاریخ</b></label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          {/* Type Dropdown */}
          <div className="mb-3">
            <label><b>Type / قسم</b></label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Purchased">Purchased / خریدا گیا</option>
              <option value="Breed">Breed / نسل</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label><b>Image / تصویر کے لیے انتخاب کریں۔</b></label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Buttons */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">Add Animal / شامل کریں</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={handleBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
