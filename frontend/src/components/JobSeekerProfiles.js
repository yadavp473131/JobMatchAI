import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  {Card, CardContent} from './Card';
import  {Badge}  from './Badge';

const JobSeekerProfiles = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);


  

  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchJobSeekers = async () => {
      try {

        const response = await axios.get('http://localhost:5000/jobseekersprofiles');
        setJobSeekers(response.data);
      } catch (error) {
        console.error('Error fetching job seekers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSeekers();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading job seekers...</p>;

  if (!jobSeekers.length) return <p className="text-center text-gray-500">No job seekers found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {jobSeekers.map((seeker) => (
        <Card key={seeker.id} className="rounded-2xl shadow-md p-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-1">{seeker.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{seeker.email}</p>
            {/* <p className="mb-2"><strong>Skills:</strong> {seeker.skills.join(', ')}</p> */}
            <p className="mb-2"><strong>Skills:</strong> {seeker.skills}</p>
             <p className="mb-2"><strong>Experience:</strong> {seeker.experience} years</p>
            {/* <div className="flex flex-wrap gap-2 mt-2">
              {seeker.skills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>  */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobSeekerProfiles;
