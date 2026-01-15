import React from "react";

// Reusable Table Components for BikeTable
function CategoryWrapper({ title, children }) {
    return (
        <div className="p-4 border rounded-md bg-white shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            {children}
        </div>
    );
}

function Table({ children }) {
    return (
        <table className="w-full border bg-white rounded-sm">{children}</table>
    );
}

function Th({ children }) {
    return <th className="p-3 border bg-gray-100">{children}</th>;
}

function Td({ children }) {
    return <td className="p-3 border text-sm">{children}</td>;
}

function ActionBtn({ children, onClick, color }) {
    const cls =
        color === "blue"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-red-600 hover:bg-red-700";

    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-md text-white text-sm ${cls} mr-2`}
        >
            {children}
        </button>
    );
}

export default function BikeTable({ items, onEdit, onDelete }) {
    console.log(items && items.length, "ITEMS ====");
    return (
        <CategoryWrapper title="Bike Listings">
            {items.length === 0 ? (
                <p>No bikes found</p>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <Th>Brand</Th>
                            <Th>Model</Th>
                            <Th>Variant</Th>
                            <Th>Price</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>

                    <tbody>
                        {[...items].reverse().map((b) => (
                            <tr key={b.bike_id}>
                                <Td>{b.brand}</Td>
                                <Td>{b.model}</Td>
                                <Td>{b.variant}</Td>
                                <Td>{b.price || b.prize}</Td>
                                <Td>{b.status}</Td>
                                <Td>
                                    <ActionBtn onClick={() => onEdit(b)} color="blue">
                                        Edit
                                    </ActionBtn>
                                    <ActionBtn onClick={() => onDelete(b)} color="red">
                                        Delete
                                    </ActionBtn>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </CategoryWrapper>
    );
}
