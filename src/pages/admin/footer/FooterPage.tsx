import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getFooter, createFooterDescription, addSocialLink, updateSocialLink, deleteSocialLink } from '../../../api/admin/adminFooter';
import { Footer, SocialLink } from '../../../api/admin/types/footer';
import { useToastStore } from '../../../store/toastStore';

const FooterPage = () => {
  const { isDarkMode } = useThemeStore();
  const { showToast } = useToastStore();
  const [isEditing, setIsEditing] = useState<'company' | 'social' | null>(null);
  const [footerContent, setFooterContent] = useState<Footer | null>(null);
  const [editingContent, setEditingContent] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);

  // Add default dummy data
  const defaultFooterContent: Footer = {
    _id: 'default',
    description: "Enter your company description here...",
    arabicDescription: "أدخل وصف شركتك هنا...",
    socialLinks: [
      {
        _id: 'dummy-1',
        platform: 'Facebook',
        url: 'https://facebook.com',
        icon: 'facebook'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const data = await getFooter();
      if (data) {
        setFooterContent(data);
        setEditingContent(data);
      } else {
        // If no data is returned, use the default content
        setFooterContent(defaultFooterContent);
        setEditingContent(defaultFooterContent);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching footer data:', error);
      showToast('Failed to load footer data', 'error');
      // On error, still set default content
      setFooterContent(defaultFooterContent);
      setEditingContent(defaultFooterContent);
      setLoading(false);
    }
  };

  const handleSave = async (section: 'company' | 'social') => {
    if (!editingContent) return;

    try {
      if (section === 'company') {
        const updatedFooter = await createFooterDescription({
          description: editingContent.description,
          arabicDescription: editingContent.arabicDescription
        });
        setFooterContent(updatedFooter);
        showToast('Company information updated successfully', 'success');
      }
      setIsEditing(null);
    } catch (error) {
      console.error('Error saving footer data:', error);
      showToast('Failed to save changes', 'error');
    }
  };

  const handleCancel = () => {
    setEditingContent(footerContent);
    setIsEditing(null);
  };

  const normalizeSocialPlatform = (platform: string): { normalizedPlatform: string, icon: string } => {
    const lowercased = platform.toLowerCase().trim();
    
    const platformMap: Record<string, { normalizedPlatform: string, icon: string }> = {
      'linkedin': { normalizedPlatform: 'LinkedIn', icon: 'linkedin' },
      'facebook': { normalizedPlatform: 'Facebook', icon: 'facebook' },
      'youtube': { normalizedPlatform: 'YouTube', icon: 'youtube' },
      'instagram': { normalizedPlatform: 'Instagram', icon: 'instagram' },
      'twitter': { normalizedPlatform: 'Twitter', icon: 'twitter' },
      'x': { normalizedPlatform: 'X', icon: 'twitter' }, // For the platform formerly known as Twitter
      'tiktok': { normalizedPlatform: 'TikTok', icon: 'tiktok' },
      'whatsapp': { normalizedPlatform: 'WhatsApp', icon: 'whatsapp' },
    };

    // Find the matching platform
    for (const [key, value] of Object.entries(platformMap)) {
      if (lowercased.includes(key)) {
        return value;
      }
    }

    // Return original if no match found
    return {
      normalizedPlatform: platform,
      icon: platform.toLowerCase()
    };
  };

  const addNewSocialLink = async () => {
    try {
      const { normalizedPlatform, icon } = normalizeSocialPlatform('New Platform');
      const newLink = {
        platform: normalizedPlatform,
        url: 'https://',
        icon: icon
      };
      const updatedFooter = await addSocialLink(newLink);
      setFooterContent(updatedFooter);
      setEditingContent(updatedFooter);
      showToast('Social link added successfully', 'success');
    } catch (error) {
      console.error('Error adding social link:', error);
      showToast('Failed to add social link', 'error');
    }
  };

  const removeSocialLink = async (linkId: string) => {
    try {
      const updatedFooter = await deleteSocialLink(linkId);
      setFooterContent(updatedFooter);
      setEditingContent(updatedFooter);
      showToast('Social link removed successfully', 'success');
    } catch (error) {
      console.error('Error removing social link:', error);
      showToast('Failed to remove social link', 'error');
    }
  };

  const handleSocialLinkChange = (linkId: string, field: keyof SocialLink, value: string) => {
    if (!editingContent) return;

    const updatedLinks = editingContent.socialLinks.map(link => {
      if (link._id === linkId) {
        // If updating platform, normalize it and set icon automatically
        if (field === 'platform') {
          const { normalizedPlatform, icon } = normalizeSocialPlatform(value);
          return { ...link, platform: normalizedPlatform, icon };
        }
        return { ...link, [field]: value };
      }
      return link;
    });

    setEditingContent({
      ...editingContent,
      socialLinks: updatedLinks
    });
  };

  const handleSaveSocialLinks = async () => {
    if (!editingContent) return;

    try {
      // Save each modified social link
      for (const link of editingContent.socialLinks) {
        if (link._id) {
          await updateSocialLink(link._id, {
            platform: link.platform,
            url: link.url,
            icon: link.icon
          });
        }
      }
      
      showToast('Social links updated successfully', 'success');
      setIsEditing(null);
      fetchFooterData(); // Refresh data after saving
    } catch (error) {
      console.error('Error updating social links:', error);
      showToast('Failed to update social links', 'error');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className={`text-2xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Manage Footer Content
      </h1>

      {/* Company Information Section */}
      <div className={`p-6 rounded-xl ${
        isDarkMode 
          ? 'bg-[#141b2d] border border-gray-800' 
          : 'bg-white shadow-md'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Company Information
            </h2>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage company details shown in the footer
            </p>
          </div>
          {isEditing !== 'company' ? (
            <button
              onClick={() => {
                setIsEditing('company');
                setEditingContent(footerContent);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSave('company')}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <FiSave className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isEditing === 'company' ? (
            <div className="space-y-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Description (English)
                </label>
                <textarea
                  value={editingContent?.description || ''}
                  onChange={(e) => setEditingContent(prev => prev ? {
                    ...prev,
                    description: e.target.value
                  } : null)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-[#1f2937] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  rows={4}
                />
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Description (Arabic)
                </label>
                <textarea
                  value={editingContent?.arabicDescription || ''}
                  onChange={(e) => setEditingContent(prev => prev ? {
                    ...prev,
                    arabicDescription: e.target.value
                  } : null)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-[#1f2937] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  rows={4}
                  dir="rtl"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Description (English)
                </h3>
                <p className={`mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {footerContent?.description}
                </p>
              </div>
              {footerContent?.arabicDescription && (
                <div>
                  <h3 className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Description (Arabic)
                  </h3>
                  <p className={`mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} dir="rtl">
                    {footerContent?.arabicDescription}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Social Links Section */}
      <div className={`p-6 rounded-xl ${
        isDarkMode 
          ? 'bg-[#141b2d] border border-gray-800' 
          : 'bg-white shadow-md'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Social Links
            </h2>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage social media links
            </p>
          </div>
          {isEditing !== 'social' ? (
            <button
              onClick={() => {
                setIsEditing('social');
                setEditingContent(footerContent);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveSocialLinks}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <FiSave className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isEditing === 'social' ? (
            <div className="space-y-4">
              {editingContent?.socialLinks?.map((link) => (
                <div key={link._id} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(link._id!, 'platform', e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Platform Name"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(link._id!, 'url', e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="URL"
                  />
                  <input
                    type="text"
                    value={link.icon || ''}
                    onChange={(e) => handleSocialLinkChange(link._id!, 'icon', e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Icon"
                  />
                  <button
                    onClick={() => link._id && removeSocialLink(link._id)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addNewSocialLink}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Social Link</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {footerContent?.socialLinks?.map((link) => (
                <div key={link._id} className="flex items-center justify-between">
                  <span className={`font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {link.platform}
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {link.url}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterPage; 