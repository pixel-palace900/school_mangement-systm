import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as studentApi from '../../api/student';

const Timetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = studentApi.getMockTimetable();
        setTimetable(response.data.timetable);
        
        // Set active day to today if it's a weekday, otherwise set to Monday
        if (days.includes(today)) {
          setActiveDay(today);
        } else {
          setActiveDay('Monday');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [today]);

  const handleDayChange = (day) => {
    setActiveDay(day);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Get the timetable for the active day
  const activeDayTimetable = timetable.find(day => day.day === activeDay);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Class Timetable</h1>
      
      {/* Day selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {days.map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? "default" : "outline"}
            onClick={() => handleDayChange(day)}
            className={`${day === today ? 'border-indigo-500' : ''}`}
          >
            {day}
            {day === today && <span className="ml-2 text-xs bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded-full">Today</span>}
          </Button>
        ))}
      </div>
      
      {/* Timetable */}
      <Card>
        <CardHeader>
          <CardTitle>{activeDay}'s Schedule</CardTitle>
          <CardDescription>
            {user?.classId && `Class ${user.classId.name} ${user.classId.section}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeDayTimetable && activeDayTimetable.periods.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeDayTimetable.periods.map((period, index) => (
                    <tr key={index} className={getCurrentPeriod(period.time) ? 'bg-indigo-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {period.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {period.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {period.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {period.teacher}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No classes scheduled for {activeDay}.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Weekly Overview */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Weekly Overview</h2>
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  {days.map((day) => (
                    <th key={day} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5, 6].map((periodNum) => (
                  <tr key={periodNum}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      Period {periodNum}
                    </td>
                    {days.map((day) => {
                      const dayData = timetable.find(d => d.day === day);
                      const periodData = dayData?.periods.find(p => p.period === periodNum);
                      
                      return (
                        <td key={day} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {periodData ? (
                            <div>
                              <div className="font-medium">{periodData.subject}</div>
                              <div className="text-xs text-gray-400">{periodData.teacher}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to check if a period is currently ongoing
const getCurrentPeriod = (timeString) => {
  // Only highlight if today is the active day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const activeDay = document.querySelector('button[variant="default"]')?.textContent.trim();
  
  if (!activeDay?.includes(today)) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Parse time string (e.g., "8:00 AM - 9:00 AM")
  const [startTime, endTime] = timeString.split(' - ');
  
  // Parse start time
  const startMatch = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!startMatch) return false;
  
  let startHour = parseInt(startMatch[1]);
  const startMinute = parseInt(startMatch[2]);
  const startPeriod = startMatch[3].toUpperCase();
  
  if (startPeriod === 'PM' && startHour !== 12) startHour += 12;
  if (startPeriod === 'AM' && startHour === 12) startHour = 0;
  
  // Parse end time
  const endMatch = endTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!endMatch) return false;
  
  let endHour = parseInt(endMatch[1]);
  const endMinute = parseInt(endMatch[2]);
  const endPeriod = endMatch[3].toUpperCase();
  
  if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
  if (endPeriod === 'AM' && endHour === 12) endHour = 0;
  
  // Check if current time is within the period
  const currentTime = currentHour * 60 + currentMinute;
  const periodStart = startHour * 60 + startMinute;
  const periodEnd = endHour * 60 + endMinute;
  
  return currentTime >= periodStart && currentTime <= periodEnd;
};

export default Timetable;
