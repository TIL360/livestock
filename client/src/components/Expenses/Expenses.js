import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import Modal from 'react-modal'; // Make sure to install react-modal

const Expenses = () => {
  const { token } = useContext(userContext);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [years, setYears] = useState([]); // State for years
  const [months, setMonths] = useState([]); // State for months
  const [error, setError] = useState(null);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError(error);
      }
    };

    const fetchYears = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses/years`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setYears(response.data); // Correctly set years state
      } catch (error) {
        console.error("Error fetching years:", error);
        setError(error);
      }
    };

    const fetchMonths = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses/months`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMonths(response.data); // Correctly set months state
      } catch (error) {
        console.error("Error fetching months:", error);
        setError(error);
      }
    };

    fetchExpenses();
    fetchYears();
    fetchMonths();
  }, [token]);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/expenses/add`,
        { description, date, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses([...expenses, { ...response.data, detail: description, date, amount }]);
      setDescription("");
      setDate("");
      setAmount("");
    } catch (error) {
      console.error("Error adding expense:", error);
      setError(error);
    }
  };

  const handleEditExpense = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/expenses/${editExpenseId}`,
        { description, date, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses(expenses.map(expense => expense.expense_id === editExpenseId ? { ...expense, detail: description, date, amount } : expense));
      setEditModalIsOpen(false);
      setDescription("");
      setDate("");
      setAmount("");
    } catch (error) {
      console.error("Error editing expense:", error);
      setError(error);
    }
  };

  const openEditModal = (expense) => {
    setEditExpenseId(expense.expense_id);
    setDescription(expense.detail);
    setDate(expense.date.split('T')[0]); // Convert to YYYY-MM-DD format for the input
    setAmount(expense.amount);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setDescription("");
    setDate("");
    setAmount("");
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseYear = new Date(expense.date).getFullYear();
    const expenseMonth = new Date(expense.date).getMonth() + 1; // Months are 0-based
    return (
      (selectedYear === "" || expenseYear.toString() === selectedYear) &&
      (selectedMonth === "" || expenseMonth.toString() === selectedMonth)
    );
  });

  // New delete handler
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(expenses.filter(expense => expense.expense_id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError(error);
    }
  };

  return (
    <div className="container" style={{ background: "white" }}>
      {error && <div className="alert alert-danger">{error.toString()}</div>}
      <h1 className="text-center">Expense Records</h1>
      <div className="row mb-3 align-items-center">
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
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <select value={selectedYear} onChange={handleYearChange} className="form-control">
            <option value="">Select Year</option>
            {years.map(year => (
              <option key={year.year} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select value={selectedMonth} onChange={handleMonthChange} className="form-control">
            <option value="">Select Month</option>
            {months.map(month => (
              <option key={month.month} value={month.month}>
                {month.month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length === 0 ? (
            <tr>
              <td colSpan="5">No expenses found</td>
            </tr>
          ) : (
            filteredExpenses.map((expense) => (
              <tr key={expense.expense_id}>
                <td>{expense.expense_id}</td>
                <td>{expense.detail}</td>
                <td>{formatDate(expense.date)}</td> {/* Use formatDate here */}
                <td>{expense.amount}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => openEditModal(expense)}>
                    Edit
                  </button>
                  <button className="btn btn-danger ml-1" onClick={() => handleDeleteExpense(expense.expense_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal isOpen={editModalIsOpen} onRequestClose={closeEditModal} >
        <h2>Edit Expense</h2>
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleEditExpense}>
            Save Changes
          </button>
          <button className="btn btn-secondary" onClick={closeEditModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
