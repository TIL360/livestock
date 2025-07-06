import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import userContext from "../context/UserContext";

export default function GoatEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(userContext);

  // State variables
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [status, setStatus] = useState(''); // e.g., Active, Sold Out, etc.
  const [type, setType] = useState('Purchased'); // default or fetched value
  const [sellOut, setSellOut] = useState(''); // New field
  const [age, setAge] = useState(''); // New field

  // Fetch existing goat data
  useEffect(() => {
    const fetchGoat = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/animals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const goat = response.data;
        setDescription(goat.description || '');
        setCost(goat.cost || '');
        setPurchaseDate(goat.purchase_date || '');
        setExistingImage(goat.image || '');
        setStatus(goat.status || '');
        setType(goat.type || 'Purchased');
        setSellOut(goat.sell_out || ''); // Initialize sell_out
        setAge(goat.age || ''); // Initialize sell_out
      } catch (error) {
        console.error("Error fetching goat:", error);
      }
    };
    fetchGoat();
  }, [id, token]);

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('cost', cost);
    formData.append('purchase_date', purchaseDate);
    formData.append('status', status);
    formData.append('type', type);
    formData.append('sell_out', sellOut); // Append new field
    formData.append('age', age); // Append new field

    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/animals/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      navigate('/dashboard/animalslist');
    } catch (err) {
      console.error('Error updating goat:', err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/animalslist');
  };

  return (
    <div className="card col-md-8 mx-auto">
      <div className="card-header">
        <h2 className="text-center">Edit Animal</h2>
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
              value={description}
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
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>

          {/* Cost */}
          <div className="mb-3">
            <label><b>Age</b></label>
            <input
              type="text"
              className="form-control"
              placeholder="Age or date of birth"
              value={age}
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
              value={purchaseDate}
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

          

          {/* Existing Image Preview */}
          {existingImage && !newImage && (
            <div className="mb-3">
              <label><b>Existing Image</b></label>
              <div>
                <img
                  src={`${process.env.REACT_APP_API_URL}/${existingImage}`}
                  alt="Existing"
                  style={{ width: "100px", height: "100px", marginTop: "10px" }}
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-3">
            <label><b>Image / تصویر کے لیے انتخاب کریں۔</b></label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Sell Out */}
          <div className="mb-3">
            <label><b>Sell Out / فروخت</b></label>
            <input
              type="text"
              className="form-control"
              placeholder="Selling cost here and then change status to sold.."
              value={sellOut}
              onChange={(e) => setSellOut(e.target.value)}
            />
          </div>

           {/* Status Dropdown */}
           <div className="mb-3">
            <label><b>Status / حالت</b></label>
            <select
              className="form-control"
              style={{ fontWeight: 'bold', background: 'Blue', color: 'white' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status / حالت منتخب کریں</option>
              <option value="Active">Active / فعال</option>
              <option value="Sold Out">Sold Out / فروخت ہو چکا</option>
              <option value="Slaughterd">Slaughterd / ذبح کیا گیا</option>
              <option value="Expired">Expired / ختم شد</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">Update Animal /  اپ ڈیٹ کریں</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={handleBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
