import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

// Mock data for timetable
const mockTimetable = [
  {
    day: 'Monday',
    periods: [
      { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 2, time: '9:15 AM - 10:15 AM', subject: 'Free Period', class: null, room: null },
      { period: 3, time: '10:30 AM - 11:30 AM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' },
      { period: 4, time: '11:45 AM - 12:45 PM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' },
      { period: 5, time: '1:30 PM - 2:30 PM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 6, time: '2:45 PM - 3:45 PM', subject: 'Free Period', class: null, room: null }
    ]
  },
  {
    day: 'Tuesday',
    periods: [
      { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' },
      { period: 2, time: '9:15 AM - 10:15 AM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 3, time: '10:30 AM - 11:30 AM', subject: 'Free Period', class: null, room: null },
      { period: 4, time: '11:45 AM - 12:45 PM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' },
      { period: 5, time: '1:30 PM - 2:30 PM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' },
      { period: 6, time: '2:45 PM - 3:45 PM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' }
    ]
  },
  {
    day: 'Wednesday',
    periods: [
      { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' },
      { period: 2, time: '9:15 AM - 10:15 AM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' },
      { period: 3, time: '10:30 AM - 11:30 AM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 4, time: '11:45 AM - 12:45 PM', subject: 'Free Period', class: null, room: null },
      { period: 5, time: '1:30 PM - 2:30 PM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' },
      { period: 6, time: '2:45 PM - 3:45 PM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' }
    ]
  },
  {
    day: 'Thursday',
    periods: [
      { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Free Period', class: null, room: null },
      { period: 2, time: '9:15 AM - 10:15 AM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 3, time: '10:30 AM - 11:30 AM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' },
      { period: 4, time: '11:45 AM - 12:45 PM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' },
      { period: 5, time: '1:30 PM - 2:30 PM', subject: 'Free Period', class: null, room: null },
      { period: 6, time: '2:45 PM - 3:45 PM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' }
    ]
  },
  {
    day: 'Friday',
    periods: [
      { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 2, time: '9:15 AM - 10:15 AM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' },
      { period: 3, time: '10:30 AM - 11:30 AM', subject: 'Physics', class: { name: '10', section: 'A' }, room: 'Lab 1' },
      { period: 4, time: '11:45 AM - 12:45 PM', subject: 'Free Period', class: null, room: null },
      { period: 5, time: '1:30 PM - 2:30 PM', subject: 'Mathematics', class: { name: '10', section: 'A' }, room: 'Room 101' },
      { period: 6, time: '2:45 PM - 3:45 PM', subject: 'Mathematics', class: { name: '9', section: 'B' }, room: 'Room 102' }
    ]
  }
];

const Timetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');

  // Get current day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    // In a real app, we would fetch timetable from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTimetable(mockTimetable);
      setSelectedDay(today);
      setLoading(false);
    }, 500);
  }, [today]);

  const selectedDaySchedule = timetable.find(day => day.day === selectedDay);

  const getSubjectColor = (subject) => {
    if (subject === 'Free Period') return 'bg-gray-100 text-gray-600';
    if (subject === 'Mathematics') return 'bg-blue-100 text-blue-800';
    if (subject === 'Physics') return 'bg-green-100 text-green-800';
    return 'bg-purple-100 text-purple-800';
  };

  const getCurrentPeriod = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    if (!selectedDaySchedule || selectedDay !== today) return null;
    
    for (const period of selectedDaySchedule.periods) {
      const [startTime, endTime] = period.time.split(' - ');
      const [startHour, startMin] = startTime.split(':');
      const [endHour, endMin] = endTime.split(':');
      
      const startMinutes = (parseInt(startHour) + (startTime.includes('PM') && startHour !== '12' ? 12 : 0)) * 60 + parseInt(startMin);
      const endMinutes = (parseInt(endHour) + (endTime.includes('PM') && endHour !== '12' ? 12 : 0)) * 60 + parseInt(endMin);
      
      if (currentTime >= startMinutes && currentTime <= endMinutes) {
        return period.period;
      }
    }
    return null;
  };

  const currentPeriod = getCurrentPeriod();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          📅 Download Schedule
        </Button>
      </div>

      {/* Day selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timetable.map((day) => (
          <Button
            key={day.day}
            variant={selectedDay === day.day ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day.day)}
            className={`${
              selectedDay === day.day 
                ? 'bg-green-600 hover:bg-green-700' 
                : ''
            } ${day.day === today ? 'ring-2 ring-blue-300' : ''}`}
          >
            {day.day}
            {day.day === today && <span className="ml-1 text-xs">(Today)</span>}
          </Button>
        ))}
      </div>

      {/* Selected day schedule */}
      {selectedDaySchedule && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedDaySchedule.day} Schedule</CardTitle>
            <CardDescription>
              {selectedDay === today && currentPeriod && (
                <Badge className="bg-green-100 text-green-800">
                  Currently in Period {currentPeriod}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDaySchedule.periods.map((period) => (
                <div
                  key={period.period}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    currentPeriod === period.period && selectedDay === today
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">Period {period.period}</p>
                      <p className="text-xs text-gray-500">{period.time}</p>
                    </div>
                    <div>
                      <Badge className={getSubjectColor(period.subject)}>
                        {period.subject}
                      </Badge>
                      {period.class && (
                        <p className="text-sm text-gray-600 mt-1">
                          Class {period.class.name}-{period.class.section}
                        </p>
                      )}
                      {period.room && (
                        <p className="text-xs text-gray-500">{period.room}</p>
                      )}
                    </div>
                  </div>
                  
                  {period.subject !== 'Free Period' && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        📋 Attendance
                      </Button>
                      <Button variant="outline" size="sm">
                        📝 Notes
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {timetable.reduce((total, day) => 
                  total + day.periods.filter(p => p.subject === 'Mathematics').length, 0
                )}
              </p>
              <p className="text-sm text-gray-500">Mathematics Periods</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {timetable.reduce((total, day) => 
                  total + day.periods.filter(p => p.subject === 'Physics').length, 0
                )}
              </p>
              <p className="text-sm text-gray-500">Physics Periods</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {timetable.reduce((total, day) => 
                  total + day.periods.filter(p => p.subject === 'Free Period').length, 0
                )}
              </p>
              <p className="text-sm text-gray-500">Free Periods</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {timetable.reduce((total, day) => 
                  total + day.periods.filter(p => p.subject !== 'Free Period').length, 0
                )}
              </p>
              <p className="text-sm text-gray-500">Total Teaching Periods</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
