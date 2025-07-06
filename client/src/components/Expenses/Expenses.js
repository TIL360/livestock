import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import Modal from "react-modal";

const Expenses = () => {
  const { token, user } = useContext(userContext);

  // State variables
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [mRaza, setMRaza] = useState("");
  const [aamerRaza, setAamerRaza] = useState("");
  const [rasheedK, setRasheedK] = useState("");
  const [remarks, setRemarks] = useState("");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const [error, setError] = useState(null);

  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  // Fetch expenses, years, months on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err);
      }
    };

    const fetchYears = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses/years`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setYears(response.data);
      } catch (err) {
        console.error("Error fetching years:", err);
        setError(err);
      }
    };

    const fetchMonths = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses/months`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonths(response.data);
      } catch (err) {
        console.error("Error fetching months:", err);
        setError(err);
      }
    };

    fetchExpenses();
    fetchYears();
    fetchMonths();
  }, [token]);

  // Helper function to format date string to yyyy-mm-dd
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Add new expense
  const handleAddExpense = async () => {
    try {
      const payload = {
        detail: description,
        date: date,
        amount: amount,
        M_Raza: mRaza,
        Aamer_Raza: aamerRaza,
        Rasheed_K: rasheedK,
        Remarks: remarks,
        created_by: user.username,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/expenses/add`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses([
        ...expenses,
        {
          ...response.data,
          detail: description,
          date: date,
          amount: amount,
          M_Raza: mRaza,
          Aamer_Raza: aamerRaza,
          Rasheed_K: rasheedK,
          Remarks: remarks,
        },
      ]);
      // Reset input fields
      setDescription("");
      setDate("");
      setAmount("");
      setMRaza("");
      setAamerRaza("");
      setRasheedK("");
      setRemarks("");
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err);
    }
  };

  // Open edit modal and populate fields
  const openEditModal = (expense) => {
    setEditExpenseId(expense.expense_id);
    setDescription(expense.detail);
    setDate(expense.date);
    setAmount(expense.amount);
    setMRaza(expense.M_Raza);
    setAamerRaza(expense.Aamer_Raza);
    setRasheedK(expense.Rasheed_K);
    setRemarks(expense.Remarks);
    setEditModalIsOpen(true);
  };

  // Close edit modal and reset fields
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setDescription("");
    setDate("");
    setAmount("");
    setMRaza("");
    setAamerRaza("");
    setRasheedK("");
    setRemarks("");
  };

  // Handle expense update
  const handleEditExpense = async () => {
    try {
      const payload = {
        detail: description,
        date: date,
        amount: amount,
        M_Raza: mRaza,
        Aamer_Raza: aamerRaza,
        Rasheed_K: rasheedK,
        Remarks: remarks,
        updated_by: user.username,
      };
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/expenses/${editExpenseId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(
        expenses.map((exp) =>
          exp.expense_id === editExpenseId
            ? {
                ...exp,
                detail: description,
                date: date,
                amount: amount,
                M_Raza: mRaza,
                Aamer_Raza: aamerRaza,
                Rasheed_K: rasheedK,
                Remarks: remarks,
              }
            : exp
        )
      );
      closeEditModal();
    } catch (err) {
      console.error("Error editing expense:", err);
      setError(err);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((exp) => exp.expense_id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err);
    }
  };

  // Filter expenses based on selected year and month
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseYear = expenseDate.getFullYear().toString();
    const expenseMonth = String(expenseDate.getMonth() + 1);
    const matchesYear = selectedYear === "" || expenseYear === selectedYear;
    const matchesMonth = selectedMonth === "" || expenseMonth === selectedMonth;
    return matchesYear && matchesMonth;
  });

  return (
    <div className="container" style={{ background: "white" }}>
      {error && <div className="alert alert-danger">{error.toString()}</div>}

      <h1 className="text-center mb-4">Expense Records</h1>

      {/* Add Expense Form */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Total Expense Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {/* Additional fields for shared expenses */}
        <div className="col-md-3 mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Expense shared by M. Raza"
            value={mRaza}
            onChange={(e) => setMRaza(e.target.value)}
          />
        </div>
        <div className="col-md-3 mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Expense shared by Aamer Raza"
            value={aamerRaza}
            onChange={(e) => setAamerRaza(e.target.value)}
          />
        </div>
        <div className="col-md-3 mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Expense shared by Rasheed.."
            value={rasheedK}
            onChange={(e) => setRasheedK(e.target.value)}
          />
        </div>
        <div className="col-md-3 mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div className="col-md-3 mt-3">
          <button className="btn btn-primary" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="form-control"
          >
            <option value="">Select Year</option>
            {years.map((yearObj) => (
              <option key={yearObj.year} value={yearObj.year}>
                {yearObj.year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-control"
          >
            <option value="">Select Month</option>
            {months.map((monthObj) => (
              <option key={monthObj.month} value={monthObj.month}>
                {monthObj.month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
            <th>M Raza</th>
            <th>Aamer</th>
            <th>Rasheed</th>
            <th>Created</th>
            <th>Last Updated</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center">
                No expenses found
              </td>
            </tr>
          ) : (
            filteredExpenses.map((expense) => (
              <tr key={expense.expense_id}>
                <td>{expense.expense_id}</td>
                <td>{expense.detail}</td>
                <td>{formatDateDisplay(expense.date)}</td>
                <td>{expense.amount}</td>
                <td>{expense.M_Raza}</td>
                <td>{expense.Aamer_Raza}</td>
                <td>{expense.Rasheed_K}</td>
                <td>{expense.created_by}<br/>{formatDateDisplay(expense.created_at)}</td>
                <td>{expense.updated_by}<br/>{formatDateDisplay(expense.updated_at)}</td>
                <td>{expense.Remarks}</td>
                <td>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => openEditModal(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteExpense(expense.expense_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Expense Modal */}
      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal}>
        <h2>Edit Expense</h2>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="text"
            className="form-control"
            placeholder="Total Expense Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {/* Editable fields for expense */}
        <div className="form-group">
          <label>M_Raza</label>
          <input
            type="text"
            className="form-control"
            placeholder="M_Raza"
            value={mRaza}
            onChange={(e) => setMRaza(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Aamer_Raza</label>
          <input
            type="text"
            className="form-control"
            placeholder="Aamer_Raza"
            value={aamerRaza}
            onChange={(e) => setAamerRaza(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Rasheed_K</label>
          <input
            type="text"
            className="form-control"
            placeholder="Rasheed_K"
            value={rasheedK}
            onChange={(e) => setRasheedK(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Remarks</label>
          <input
            type="text"
            className="form-control"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleEditExpense}>
          Save Changes
        </button>
        <button className="btn btn-secondary ml-2" onClick={closeEditModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default Expenses;
