import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiFileText,
  FiEye,
} from "react-icons/fi";

import {
  deleteExpense,
  updateExpense,
} from "../../services/expenseService";

function ExpenseList({
  expenses,
  onExpenseChanged,
}) {
  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      title: "",
      amount: "",
      category: "",
      merchant: "",
      expense_date: "",
    });


  const startEdit = (expense) => {
    setEditingId(expense.id);

    setEditData({
      title:
        expense.title || "",

      amount:
        expense.amount || "",

      category:
        expense.category || "",

      merchant:
        expense.merchant || "",

      expense_date:
        expense.expense_date || "",
    });
  };


  const cancelEdit = () => {
    setEditingId(null);

    setEditData({
      title: "",
      amount: "",
      category: "",
      merchant: "",
      expense_date: "",
    });
  };


  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleUpdate = async (id) => {
    try {
      await updateExpense(
        id,
        editData
      );

      alert(
        "Expense updated successfully!"
      );

      setEditingId(null);

      if (onExpenseChanged) {
        await onExpenseChanged();
      }

    } catch (error) {
      console.error(
        "Update Expense Error:",
        error
      );

      if (error.response) {
        alert(
          "Failed to update expense\n\n" +
          JSON.stringify(
            error.response.data
          )
        );
      } else {
        alert(
          "Failed to connect to backend"
        );
      }
    }
  };


  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteExpense(id);

      alert(
        "Expense deleted successfully!"
      );

      if (onExpenseChanged) {
        await onExpenseChanged();
      }

    } catch (error) {
      console.error(
        "Delete Expense Error:",
        error
      );

      if (error.response) {
        alert(
          "Failed to delete expense\n\n" +
          JSON.stringify(
            error.response.data
          )
        );
      } else {
        alert(
          "Failed to connect to backend"
        );
      }
    }
  };


  const getReceiptUrl = (receipt) => {
    if (!receipt) {
      return null;
    }

    if (receipt.startsWith("http")) {
      return receipt;
    }

    return (
      `http://127.0.0.1:8000${receipt}`
    );
  };


  /* EMPTY STATE */

  if (
    !expenses ||
    expenses.length === 0
  ) {
    return (
      <div className="empty-expense-state">

        <div className="empty-icon">
          <FiFileText />
        </div>

        <h3>
          No expenses found
        </h3>

        <p>
          Start tracking your expenses
          by adding your first transaction.
        </p>

      </div>
    );
  }


  return (
    <div className="expense-table-wrapper">

      <div className="table-scroll">

        <table className="expense-table">

          <thead>

            <tr>
              <th>
                Expense
              </th>

              <th>
                Category
              </th>

              <th>
                Merchant
              </th>

              <th>
                Date
              </th>

              <th>
                Amount
              </th>

              <th>
                Receipt
              </th>

              <th className="actions-column">
                Actions
              </th>
            </tr>

          </thead>


          <tbody>

            {expenses.map(
              (expense) => {
                const isEditing =
                  editingId ===
                  expense.id;


                /* EDIT MODE */

                if (isEditing) {
                  return (
                    <tr
                      key={expense.id}
                      className="editing-row"
                    >

                      {/* TITLE */}

                      <td>

                        <input
                          className="table-input"
                          type="text"
                          name="title"
                          value={
                            editData.title
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <select
                          className="table-input"
                          name="category"
                          value={
                            editData.category
                          }
                          onChange={
                            handleEditChange
                          }
                        >

                          <option value="">
                            Select
                          </option>

                          <option value="Food">
                            Food
                          </option>

                          <option value="Travel">
                            Travel
                          </option>

                          <option value="Shopping">
                            Shopping
                          </option>

                          <option value="Bills">
                            Bills
                          </option>

                          <option value="Healthcare">
                            Healthcare
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>

                      </td>


                      {/* MERCHANT */}

                      <td>

                        <input
                          className="table-input"
                          type="text"
                          name="merchant"
                          value={
                            editData.merchant
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      {/* DATE */}

                      <td>

                        <input
                          className="table-input"
                          type="date"
                          name="expense_date"
                          value={
                            editData.expense_date
                          }
                          onChange={
                            handleEditChange
                          }
                        />

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <input
                          className="table-input amount-input"
                          type="number"
                          name="amount"
                          value={
                            editData.amount
                          }
                          onChange={
                            handleEditChange
                          }
                          step="0.01"
                        />

                      </td>


                      {/* RECEIPT */}

                      <td>

                        {expense.receipt ? (

                          <a
                            className="receipt-link"
                            href={
                              getReceiptUrl(
                                expense.receipt
                              )
                            }
                            target="_blank"
                            rel="noreferrer"
                          >

                            <FiEye />

                            View

                          </a>

                        ) : (

                          <span className="no-receipt">
                            —
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="action-button save-action"
                            title="Save changes"
                            onClick={() =>
                              handleUpdate(
                                expense.id
                              )
                            }
                          >

                            <FiSave />

                          </button>


                          <button
                            type="button"
                            className="action-button cancel-action"
                            title="Cancel editing"
                            onClick={
                              cancelEdit
                            }
                          >

                            <FiX />

                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }


                /* NORMAL ROW */

                return (
                  <tr key={expense.id}>

                    {/* EXPENSE */}

                    <td>

                      <div className="expense-name">

                        <div className="expense-avatar">

                          <FiFileText />

                        </div>

                        <div>

                          <strong>
                            {expense.title}
                          </strong>

                          <span>
                            ID #
                            {expense.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      <span className="category-badge">

                        {expense.category}

                      </span>

                    </td>


                    {/* MERCHANT */}

                    <td>

                      <span className="merchant-name">

                        {expense.merchant ||
                          "—"}

                      </span>

                    </td>


                    {/* DATE */}

                    <td>

                      <span className="expense-date">

                        {expense.expense_date}

                      </span>

                    </td>


                    {/* AMOUNT */}

                    <td>

                      <strong className="expense-amount">

                        ₹
                        {Number(
                          expense.amount
                        ).toFixed(2)}

                      </strong>

                    </td>


                    {/* RECEIPT */}

                    <td>

                      {expense.receipt ? (

                        <a
                          className="receipt-link"
                          href={
                            getReceiptUrl(
                              expense.receipt
                            )
                          }
                          target="_blank"
                          rel="noreferrer"
                        >

                          <FiEye />

                          View

                        </a>

                      ) : (

                        <span className="no-receipt">

                          No receipt

                        </span>

                      )}

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="table-actions">

                        <button
                          type="button"
                          className="action-button edit-action"
                          title="Edit expense"
                          onClick={() =>
                            startEdit(
                              expense
                            )
                          }
                        >

                          <FiEdit2 />

                        </button>


                        <button
                          type="button"
                          className="action-button delete-action"
                          title="Delete expense"
                          onClick={() =>
                            handleDelete(
                              expense.id
                            )
                          }
                        >

                          <FiTrash2 />

                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ExpenseList;