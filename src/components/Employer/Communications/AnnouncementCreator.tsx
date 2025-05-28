import {
    Bell,
    Calendar,
    Eye,
    Paperclip,
    Save,
    Send,
    Target,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'wellness' | 'benefits';
  audience: 'all' | 'department' | 'role' | 'custom';
  departments?: string[];
  roles?: string[];
  customGroups?: string[];
  scheduledDate?: string;
  priority: 'low' | 'medium' | 'high';
  channels: ('app' | 'email' | 'sms')[];
  attachments?: File[];
  status: 'draft' | 'scheduled' | 'sent';
}

export default function AnnouncementCreator() {
  const [announcement, setAnnouncement] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    type: 'general',
    audience: 'all',
    priority: 'medium',
    channels: ['app'],
    status: 'draft'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const departments = [
    'Engineering', 'Marketing', 'Sales', 'Human Resources', 
    'Finance', 'Operations', 'Customer Success'
  ];

  const roles = [
    'Managers', 'Individual Contributors', 'Executives', 
    'New Hires', 'Remote Workers'
  ];

  const announcementTypes = [
    { value: 'general', label: 'General Announcement', color: 'bg-blue-100 text-blue-800' },
    { value: 'urgent', label: 'Urgent Notice', color: 'bg-red-100 text-red-800' },
    { value: 'wellness', label: 'Wellness Update', color: 'bg-green-100 text-green-800' },
    { value: 'benefits', label: 'Benefits Information', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    // Implement send logic
    console.log('Sending announcement:', announcement);
    setAnnouncement(prev => ({ ...prev, status: 'sent' }));
  };

  const handleSchedule = () => {
    // Implement schedule logic
    console.log('Scheduling announcement:', announcement);
    setAnnouncement(prev => ({ ...prev, status: 'scheduled' }));
    setShowScheduler(false);
  };

  const handleSaveDraft = () => {
    // Implement save draft logic
    console.log('Saving draft:', announcement);
  };

  const getEstimatedReach = () => {
    // Calculate estimated reach based on audience selection
    const totalEmployees = 412;
    
    if (announcement.audience === 'all') return totalEmployees;
    if (announcement.audience === 'department' && announcement.departments) {
      return announcement.departments.length * 50; // Approximate
    }
    if (announcement.audience === 'role' && announcement.roles) {
      return announcement.roles.length * 75; // Approximate
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-lg">Create Announcement</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 flex items-center"
          >
            <Eye size={14} className="mr-1" />
            Preview
          </button>
          <button
            onClick={handleSaveDraft}
            className="bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 flex items-center"
          >
            <Save size={14} className="mr-1" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={announcement.title}
            onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter announcement title..."
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Type and Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={announcement.type}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, type: e.target.value as Announcement['type'] }))}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              {announcementTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={announcement.priority}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, priority: e.target.value as Announcement['priority'] }))}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
          <textarea
            value={announcement.content}
            onChange={(e) => setAnnouncement(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your announcement message here..."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            {announcement.content?.length || 0}/1000 characters
          </div>
        </div>

        {/* Audience Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="audience"
                  value="all"
                  checked={announcement.audience === 'all'}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, audience: e.target.value as Announcement['audience'] }))}
                  className="mr-2"
                />
                <span className="text-sm">All Employees</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="audience"
                  value="department"
                  checked={announcement.audience === 'department'}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, audience: e.target.value as Announcement['audience'] }))}
                  className="mr-2"
                />
                <span className="text-sm">By Department</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="audience"
                  value="role"
                  checked={announcement.audience === 'role'}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, audience: e.target.value as Announcement['audience'] }))}
                  className="mr-2"
                />
                <span className="text-sm">By Role</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="audience"
                  value="custom"
                  checked={announcement.audience === 'custom'}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, audience: e.target.value as Announcement['audience'] }))}
                  className="mr-2"
                />
                <span className="text-sm">Custom Group</span>
              </label>
            </div>

            {/* Department Selection */}
            {announcement.audience === 'department' && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Select Departments</div>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => (
                    <label key={dept} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={announcement.departments?.includes(dept)}
                        onChange={(e) => {
                          const departments = announcement.departments || [];
                          if (e.target.checked) {
                            setAnnouncement(prev => ({ 
                              ...prev, 
                              departments: [...departments, dept] 
                            }));
                          } else {
                            setAnnouncement(prev => ({ 
                              ...prev, 
                              departments: departments.filter(d => d !== dept) 
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Role Selection */}
            {announcement.audience === 'role' && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Select Roles</div>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={announcement.roles?.includes(role)}
                        onChange={(e) => {
                          const roles = announcement.roles || [];
                          if (e.target.checked) {
                            setAnnouncement(prev => ({ 
                              ...prev, 
                              roles: [...roles, role] 
                            }));
                          } else {
                            setAnnouncement(prev => ({ 
                              ...prev, 
                              roles: roles.filter(r => r !== role) 
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Estimated Reach */}
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex items-center text-blue-800">
              <Users size={16} className="mr-2" />
              <span className="text-sm font-medium">
                Estimated Reach: {getEstimatedReach()} employees
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Channels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Channels</label>
          <div className="flex space-x-4">
            {[
              { value: 'app', label: 'In-App Notification', icon: Bell },
              { value: 'email', label: 'Email', icon: Send },
              { value: 'sms', label: 'SMS', icon: Target }
            ].map(channel => (
              <label key={channel.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={announcement.channels?.includes(channel.value as any)}
                  onChange={(e) => {
                    const channels = announcement.channels || [];
                    if (e.target.checked) {
                      setAnnouncement(prev => ({ 
                        ...prev, 
                        channels: [...channels, channel.value as any] 
                      }));
                    } else {
                      setAnnouncement(prev => ({ 
                        ...prev, 
                        channels: channels.filter(c => c !== channel.value) 
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <channel.icon size={16} className="mr-1" />
                <span className="text-sm">{channel.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-center">
                <Paperclip size={24} className="mx-auto text-gray-400 mb-2" />
                <div className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB each
                </div>
              </div>
            </label>
          </div>

          {/* Attached Files */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <Paperclip size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowScheduler(true)}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded text-sm hover:bg-gray-200 flex items-center justify-center"
          >
            <Calendar size={16} className="mr-2" />
            Schedule for Later
          </button>
          <button
            onClick={handleSend}
            disabled={!announcement.title || !announcement.content}
            className="flex-1 bg-purple-600 text-white py-3 rounded text-sm hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={16} className="mr-2" />
            Send Now
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-lg">Preview Announcement</div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-2 py-1 rounded text-xs ${
                  announcementTypes.find(t => t.value === announcement.type)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {announcementTypes.find(t => t.value === announcement.type)?.label}
                </div>
                <div className="text-xs text-gray-500">
                  {announcement.priority === 'high' && '🔴 High Priority'}
                  {announcement.priority === 'medium' && '🟡 Medium Priority'}
                  {announcement.priority === 'low' && '🟢 Low Priority'}
                </div>
              </div>
              
              <div className="font-medium mb-2">{announcement.title || 'Announcement Title'}</div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {announcement.content || 'Announcement content will appear here...'}
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">Attachments:</div>
                  {attachments.map((file, index) => (
                    <div key={index} className="text-xs text-blue-600 flex items-center">
                      <Paperclip size={12} className="mr-1" />
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                Will be sent via: {announcement.channels?.join(', ') || 'No channels selected'}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleSend();
                }}
                className="flex-1 bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-lg">Schedule Announcement</div>
              <button
                onClick={() => setShowScheduler(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={announcement.scheduledDate}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send Time</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>9:00 AM</option>
                  <option>12:00 PM</option>
                  <option>3:00 PM</option>
                  <option>5:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Eastern Time (ET)</option>
                  <option>Central Time (CT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Pacific Time (PT)</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowScheduler(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="flex-1 bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}