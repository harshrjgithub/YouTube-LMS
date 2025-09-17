import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { Loader2, User, BookOpen, Target, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { data: profileData, isLoading: profileLoading, refetch } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    areasOfInterest: [],
    skillLevel: 'beginner',
    learningGoals: [],
    preferredLearningStyle: 'visual',
    photoURL: ''
  });

  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');

  // Predefined options
  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const learningStyles = [
    { value: 'visual', label: 'Visual (Images, diagrams)' },
    { value: 'auditory', label: 'Auditory (Listening, discussion)' },
    { value: 'kinesthetic', label: 'Kinesthetic (Hands-on, practice)' },
    { value: 'reading', label: 'Reading/Writing (Text-based)' }
  ];

  const commonInterests = [
    'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
    'UI/UX Design', 'Digital Marketing', 'Business', 'Photography',
    'Graphic Design', 'Programming', 'Cybersecurity', 'Cloud Computing'
  ];

  useEffect(() => {
    if (profileData?.user) {
      const user = profileData.user;
      setFormData({
        name: user.name || '',
        bio: user.profile?.bio || '',
        areasOfInterest: user.profile?.areasOfInterest || [],
        skillLevel: user.profile?.skillLevel || 'beginner',
        learningGoals: user.profile?.learningGoals || [],
        preferredLearningStyle: user.profile?.preferredLearningStyle || 'visual',
        photoURL: user.photoURL || ''
      });
    }
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInterest = (interest) => {
    if (interest && !formData.areasOfInterest.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        areasOfInterest: [...prev.areasOfInterest, interest]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.filter(i => i !== interest)
    }));
  };

  const addGoal = () => {
    if (newGoal && !formData.learningGoals.includes(newGoal)) {
      setFormData(prev => ({
        ...prev,
        learningGoals: [...prev.learningGoals, newGoal]
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.filter(g => g !== goal)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      refetch();
      
      // If this is first-time profile completion, redirect to courses
      if (!profileData?.user?.profile?.isProfileComplete) {
        setTimeout(() => {
          navigate('/courses');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isFirstTime = !profileData?.user?.profile?.isProfileComplete;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFirstTime ? 'Complete Your Profile' : 'Edit Profile'}
          </h1>
          <p className="text-gray-600">
            {isFirstTime 
              ? 'Help us personalize your learning experience'
              : 'Update your information and preferences'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="skillLevel">Current Skill Level</Label>
                  <Select 
                    value={formData.skillLevel} 
                    onValueChange={(value) => handleInputChange('skillLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Areas of Interest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Areas of Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Add Buttons */}
              <div>
                <Label>Quick Add</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonInterests.map(interest => (
                    <Button
                      key={interest}
                      type="button"
                      variant={formData.areasOfInterest.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => addInterest(interest)}
                      disabled={formData.areasOfInterest.includes(interest)}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Interest */}
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add custom interest..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(newInterest))}
                />
                <Button type="button" onClick={() => addInterest(newInterest)}>
                  Add
                </Button>
              </div>

              {/* Selected Interests */}
              {formData.areasOfInterest.length > 0 && (
                <div>
                  <Label>Selected Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.areasOfInterest.map(interest => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="What do you want to achieve?"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                />
                <Button type="button" onClick={addGoal}>
                  Add Goal
                </Button>
              </div>

              {formData.learningGoals.length > 0 && (
                <div>
                  <Label>Your Goals</Label>
                  <div className="space-y-2 mt-2">
                    {formData.learningGoals.map((goal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span>{goal}</span>
                        <button
                          type="button"
                          onClick={() => removeGoal(goal)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Style */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="learningStyle">Preferred Learning Style</Label>
                <Select 
                  value={formData.preferredLearningStyle} 
                  onValueChange={(value) => handleInputChange('preferredLearningStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningStyles.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                isFirstTime ? 'Complete Profile' : 'Update Profile'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;