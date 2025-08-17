import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [jobPosters, setJobPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const [seekersRes, postersRes] = await Promise.all([
          axios.get("/api/users/jobseekers"),
          axios.get("/api/users/jobposters"),
        ]);

        setJobSeekers(seekersRes.data);
        setJobPosters(postersRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-4">Loading user data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Job Seekers</h3>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Skills</th>
            </tr>
          </thead>
          <tbody>
            {jobSeekers.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.skills?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Job Posters</h3>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Posted Jobs</th>
            </tr>
          </thead>
          <tbody>
            {jobPosters.map((poster) => (
              <tr key={poster._id}>
                <td className="p-2 border">{poster.companyName}</td>
                <td className="p-2 border">{poster.email}</td>
                <td className="p-2 border">{poster.jobs?.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
