import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Ban, CheckCircle, RefreshCw, Database, Trash2, UserPlus, Edit, Eye, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminAPI, getFileUrl } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  role: string;
  membershipTier: string;
  membershipStatus: string;
  approvalStatus: string;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  profilePictureUrl?: string;
  chapterId?: string;
  interests?: string[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  membershipExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MemberManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [createForm, setCreateForm] = useState<Partial<User & { password: string }>>({
    role: 'member',
    membershipTier: 'foundation',
    membershipStatus: 'pending',
    approvalStatus: 'pending',
    onboardingCompleted: false,
    emailVerified: false,
  });
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [createAvatarFile, setCreateAvatarFile] = useState<File | null>(null);
  const [createAvatarPreview, setCreateAvatarPreview] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers({ 
        status: filterStatus === 'all' ? undefined : filterStatus 
      });
      
      if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to fetch users', 
        variant: 'destructive' 
      });
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [filterStatus]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string, name: string) => {
    try {
      await adminAPI.deleteUser(id);
      toast({ title: 'Success', description: `User ${name} deleted` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      await adminAPI.approveUser(id);
      toast({ title: 'Success', description: `${name} approved` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await adminAPI.rejectUser(id);
      toast({ title: 'Success', description: `${name} rejected` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      organization: user.organization,
      jobTitle: user.jobTitle,
      role: user.role,
      membershipTier: user.membershipTier,
      membershipStatus: user.membershipStatus,
      approvalStatus: user.approvalStatus,
      onboardingCompleted: user.onboardingCompleted,
      emailVerified: user.emailVerified,
      profilePictureUrl: user.profilePictureUrl,
      chapterId: user.chapterId,
      interests: user.interests,
    });
    setEditAvatarFile(null);
    setEditAvatarPreview(user.profilePictureUrl ? getFileUrl(user.profilePictureUrl) : null);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setCreateForm({
      role: 'member',
      membershipTier: 'foundation',
      membershipStatus: 'pending',
      approvalStatus: 'pending',
      onboardingCompleted: false,
      emailVerified: false,
    });
    setCreateAvatarFile(null);
    setCreateAvatarPreview(null);
    setCreateDialogOpen(true);
  };

  const handleEditAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: 'File size must be less than 5MB', variant: 'destructive' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Error', description: 'File must be an image', variant: 'destructive' });
        return;
      }
      setEditAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditAvatarRemove = () => {
    setEditAvatarFile(null);
    setEditAvatarPreview(null);
    setEditForm({...editForm, profilePictureUrl: undefined});
  };

  const handleCreateAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: 'File size must be less than 5MB', variant: 'destructive' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Error', description: 'File must be an image', variant: 'destructive' });
        return;
      }
      setCreateAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAvatarRemove = () => {
    setCreateAvatarFile(null);
    setCreateAvatarPreview(null);
    setCreateForm({...createForm, profilePictureUrl: undefined});
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      let dataToSend = editForm;
      
      // If there's an avatar file, we need to upload it first
      if (editAvatarFile) {
        const formData = new FormData();
        formData.append('avatar', editAvatarFile);
        
        // Add all other form fields
        Object.keys(editForm).forEach(key => {
          const value = editForm[key as keyof typeof editForm];
          if (value !== undefined && value !== null) {
            formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
          }
        });
        
        dataToSend = formData as any;
      }
      
      await adminAPI.updateUser(selectedUser.id, dataToSend);
      toast({ title: 'Success', description: 'User updated successfully' });
      setEditDialogOpen(false);
      setEditAvatarFile(null);
      setEditAvatarPreview(null);
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update user', variant: 'destructive' });
    }
  };

  const handleSaveCreate = async () => {
    try {
      if (!createForm.email || !createForm.password || !createForm.fullName) {
        toast({ title: 'Error', description: 'Email, password, and full name are required', variant: 'destructive' });
        return;
      }
      
      let dataToSend = createForm;
      
      // If there's an avatar file, we need to upload it
      if (createAvatarFile) {
        const formData = new FormData();
        formData.append('avatar', createAvatarFile);
        
        // Add all other form fields
        Object.keys(createForm).forEach(key => {
          const value = createForm[key as keyof typeof createForm];
          if (value !== undefined && value !== null) {
            formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
          }
        });
        
        dataToSend = formData as any;
      }
      
      await adminAPI.createUser(dataToSend);
      toast({ title: 'Success', description: 'User created successfully' });
      setCreateDialogOpen(false);
      setCreateAvatarFile(null);
      setCreateAvatarPreview(null);
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create user', variant: 'destructive' });
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.membershipStatus === 'active') return <Badge className="bg-green-600">Active</Badge>;
    if (user.membershipStatus === 'approved') return <Badge className="bg-blue-600">Approved</Badge>;
    if (user.membershipStatus === 'rejected') return <Badge variant="destructive">Rejected</Badge>;
    if (user.membershipStatus === 'pending') return <Badge variant="outline">Pending</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return <Card className="p-12 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin" /></Card>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">User Management</h2>
          <Badge variant="default"><Database className="h-3 w-3 mr-1" />Live</Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} variant="default" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
          <Button onClick={fetchUsers} variant="outline" size="sm"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-500 mb-4">No users found</p>
        </div>
      ) : (
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Avatar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {u.profilePictureUrl ? (
                    <img 
                      src={getFileUrl(u.profilePictureUrl)} 
                      alt={u.fullName} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-gray-200">
                      <span className="text-sm font-semibold text-white">
                        {getInitials(u.fullName)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{u.fullName}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                  {u.organization && <div className="text-xs text-gray-400">{u.organization}</div>}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>{u.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{u.membershipTier}</Badge>
                </td>
                <td className="px-4 py-3">{getStatusBadge(u)}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleView(u)} title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(u)} title="Edit User">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {u.approvalStatus === 'pending' && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleApprove(u.id, u.fullName)} className="text-green-600" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleReject(u.id, u.fullName)} className="text-red-600" title="Reject">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-red-600" title="Delete User">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {u.fullName}?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. All user data will be permanently deleted.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(u.id, u.fullName)} className="bg-red-600">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Full Name</Label>
                  <p className="font-medium">{selectedUser.fullName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">First Name</Label>
                  <p className="font-medium">{selectedUser.firstName || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Last Name</Label>
                  <p className="font-medium">{selectedUser.lastName || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Phone</Label>
                  <p className="font-medium">{selectedUser.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Organization</Label>
                  <p className="font-medium">{selectedUser.organization || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Job Title</Label>
                  <p className="font-medium">{selectedUser.jobTitle || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Role</Label>
                  <Badge variant={selectedUser.role === 'admin' ? 'default' : 'outline'}>{selectedUser.role}</Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Membership Tier</Label>
                  <Badge variant="outline">{selectedUser.membershipTier}</Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Membership Status</Label>
                  <Badge className={selectedUser.membershipStatus === 'active' ? 'bg-green-600' : ''}>{selectedUser.membershipStatus}</Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Approval Status</Label>
                  <Badge variant={selectedUser.approvalStatus === 'approved' ? 'default' : selectedUser.approvalStatus === 'rejected' ? 'destructive' : 'outline'}>
                    {selectedUser.approvalStatus}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Onboarding Completed</Label>
                  <p className="font-medium">{selectedUser.onboardingCompleted ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email Verified</Label>
                  <p className="font-medium">{selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Stripe Customer ID</Label>
                  <p className="font-medium text-xs">{selectedUser.stripeCustomerId || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Stripe Subscription ID</Label>
                  <p className="font-medium text-xs">{selectedUser.stripeSubscriptionId || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Created At</Label>
                  <p className="font-medium text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Updated At</Label>
                  <p className="font-medium text-sm">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Account</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Update user information, membership details, and account status
            </p>
          </DialogHeader>
          <Tabs defaultValue="basic" className="pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="status">Status & Flags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                {/* Avatar Upload Section */}
                <div>
                  <Label>Profile Avatar</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {editAvatarPreview ? (
                      <div className="relative">
                        <img 
                          src={editAvatarPreview} 
                          alt="Avatar preview" 
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleEditAvatarRemove}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="edit-avatar-upload"
                        accept="image/*"
                        onChange={handleEditAvatarChange}
                        className="hidden"
                      />
                      <label htmlFor="edit-avatar-upload">
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Avatar
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input 
                    id="edit-email"
                    type="email"
                    value={editForm.email || ''} 
                    onChange={e => setEditForm({...editForm, email: e.target.value})} 
                    disabled 
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input 
                    id="edit-fullName"
                    value={editForm.fullName || ''} 
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})} 
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-firstName">First Name</Label>
                    <Input 
                      id="edit-firstName"
                      value={editForm.firstName || ''} 
                      onChange={e => setEditForm({...editForm, firstName: e.target.value})} 
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-lastName">Last Name</Label>
                    <Input 
                      id="edit-lastName"
                      value={editForm.lastName || ''} 
                      onChange={e => setEditForm({...editForm, lastName: e.target.value})} 
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input 
                      id="edit-phone"
                      type="tel"
                      value={editForm.phone || ''} 
                      onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-jobTitle">Job Title</Label>
                    <Input 
                      id="edit-jobTitle"
                      value={editForm.jobTitle || ''} 
                      onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} 
                      placeholder="Real Estate Manager"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-organization">Organization / Company</Label>
                  <Input 
                    id="edit-organization"
                    value={editForm.organization || ''} 
                    onChange={e => setEditForm({...editForm, organization: e.target.value})} 
                    placeholder="Company Name Inc."
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="membership" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-role">User Role</Label>
                  <Select value={editForm.role} onValueChange={role => setEditForm({...editForm, role})}>
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Admins have full system access</p>
                </div>
                
                <div>
                  <Label htmlFor="edit-membershipTier">Membership Tier</Label>
                  <Select value={editForm.membershipTier} onValueChange={membershipTier => setEditForm({...editForm, membershipTier})}>
                    <SelectTrigger id="edit-membershipTier">
                      <SelectValue placeholder="Select membership tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">Foundation - $495</SelectItem>
                      <SelectItem value="growth">Growth - $995</SelectItem>
                      <SelectItem value="stakeholder">Stakeholder - $1495</SelectItem>
                      <SelectItem value="professional">Professional - $1995</SelectItem>
                      <SelectItem value="enterprise">Enterprise - $3995</SelectItem>
                      <SelectItem value="founding">Founding - $5995</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Determines access level and benefits</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="status" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-blue-900 mb-3">Account Status</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="edit-approvalStatus">Approval Status</Label>
                      <Select value={editForm.approvalStatus} onValueChange={approvalStatus => setEditForm({...editForm, approvalStatus})}>
                        <SelectTrigger id="edit-approvalStatus">
                          <SelectValue placeholder="Select approval status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending - Awaiting review</SelectItem>
                          <SelectItem value="approved">✅ Approved - Full access</SelectItem>
                          <SelectItem value="rejected">❌ Rejected - Access denied</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600 mt-1">User's application review status</p>
                    </div>

                    <div>
                      <Label htmlFor="edit-membershipStatus">Membership Status</Label>
                      <Select value={editForm.membershipStatus} onValueChange={membershipStatus => setEditForm({...editForm, membershipStatus})}>
                        <SelectTrigger id="edit-membershipStatus">
                          <SelectValue placeholder="Select membership status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending - Awaiting decision</SelectItem>
                          <SelectItem value="approved">✅ Approved - Access granted</SelectItem>
                          <SelectItem value="rejected">❌ Rejected - Access denied</SelectItem>
                          <SelectItem value="active">🎉 Active - Payment completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600 mt-1">Overall membership state (set to Active after successful payment)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-green-900 mb-3">Account Flags</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="onboardingCompleted" 
                        checked={editForm.onboardingCompleted || false} 
                        onCheckedChange={checked => setEditForm({...editForm, onboardingCompleted: checked as boolean})} 
                      />
                      <Label htmlFor="onboardingCompleted" className="cursor-pointer">
                        Onboarding Completed
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">User finished setup process</p>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emailVerified" 
                        checked={editForm.emailVerified || false} 
                        onCheckedChange={checked => setEditForm({...editForm, emailVerified: checked as boolean})} 
                      />
                      <Label htmlFor="emailVerified" className="cursor-pointer">
                        Email Verified
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">Email address has been confirmed</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSaveEdit} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={() => setEditDialogOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User Account</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Add a new user to the system with initial settings
            </p>
          </DialogHeader>
          <Tabs defaultValue="basic" className="pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="status">Status & Flags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Required fields:</strong> Email, Password, and Full Name are mandatory to create a user account.
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Avatar Upload Section */}
                <div>
                  <Label>Profile Avatar</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {createAvatarPreview ? (
                      <div className="relative">
                        <img 
                          src={createAvatarPreview} 
                          alt="Avatar preview" 
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleCreateAvatarRemove}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="create-avatar-upload"
                        accept="image/*"
                        onChange={handleCreateAvatarChange}
                        className="hidden"
                      />
                      <label htmlFor="create-avatar-upload">
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Avatar
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="create-email">Email Address *</Label>
                  <Input 
                    id="create-email"
                    type="email" 
                    value={createForm.email || ''} 
                    onChange={e => setCreateForm({...createForm, email: e.target.value})} 
                    placeholder="user@example.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be a valid email address</p>
                </div>

                <div>
                  <Label htmlFor="create-password">Password *</Label>
                  <Input 
                    id="create-password"
                    type="password" 
                    value={createForm.password || ''} 
                    onChange={e => setCreateForm({...createForm, password: e.target.value})} 
                    placeholder="Enter secure password"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended</p>
                </div>

                <div>
                  <Label htmlFor="create-fullName">Full Name *</Label>
                  <Input 
                    id="create-fullName"
                    value={createForm.fullName || ''} 
                    onChange={e => setCreateForm({...createForm, fullName: e.target.value})} 
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-firstName">First Name</Label>
                    <Input 
                      id="create-firstName"
                      value={createForm.firstName || ''} 
                      onChange={e => setCreateForm({...createForm, firstName: e.target.value})} 
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-lastName">Last Name</Label>
                    <Input 
                      id="create-lastName"
                      value={createForm.lastName || ''} 
                      onChange={e => setCreateForm({...createForm, lastName: e.target.value})} 
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-phone">Phone Number</Label>
                    <Input 
                      id="create-phone"
                      type="tel"
                      value={createForm.phone || ''} 
                      onChange={e => setCreateForm({...createForm, phone: e.target.value})} 
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-jobTitle">Job Title</Label>
                    <Input 
                      id="create-jobTitle"
                      value={createForm.jobTitle || ''} 
                      onChange={e => setCreateForm({...createForm, jobTitle: e.target.value})} 
                      placeholder="Real Estate Manager"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="create-organization">Organization / Company</Label>
                  <Input 
                    id="create-organization"
                    value={createForm.organization || ''} 
                    onChange={e => setCreateForm({...createForm, organization: e.target.value})} 
                    placeholder="Company Name Inc."
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="membership" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-role">User Role</Label>
                  <Select value={createForm.role} onValueChange={role => setCreateForm({...createForm, role})}>
                    <SelectTrigger id="create-role">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member - Standard user access</SelectItem>
                      <SelectItem value="admin">Administrator - Full system access</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Determines system permissions and capabilities</p>
                </div>
                
                <div>
                  <Label htmlFor="create-membershipTier">Membership Tier</Label>
                  <Select value={createForm.membershipTier} onValueChange={membershipTier => setCreateForm({...createForm, membershipTier})}>
                    <SelectTrigger id="create-membershipTier">
                      <SelectValue placeholder="Select membership tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">Foundation - $495</SelectItem>
                      <SelectItem value="growth">Growth - $995</SelectItem>
                      <SelectItem value="stakeholder">Stakeholder - $1495</SelectItem>
                      <SelectItem value="professional">Professional - $1995</SelectItem>
                      <SelectItem value="enterprise">Enterprise - $3995</SelectItem>
                      <SelectItem value="founding">Founding - $5995</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Determines access level and benefits</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="status" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-blue-900 mb-3">Initial Account Status</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="create-approvalStatus">Approval Status</Label>
                      <Select value={createForm.approvalStatus} onValueChange={approvalStatus => setCreateForm({...createForm, approvalStatus})}>
                        <SelectTrigger id="create-approvalStatus">
                          <SelectValue placeholder="Select approval status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending - Awaiting review</SelectItem>
                          <SelectItem value="approved">✅ Approved - Full access granted</SelectItem>
                          <SelectItem value="rejected">❌ Rejected - Access denied</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600 mt-1">Set to 'Approved' for immediate access</p>
                    </div>

                    <div>
                      <Label htmlFor="create-membershipStatus">Membership Status</Label>
                      <Select value={createForm.membershipStatus} onValueChange={membershipStatus => setCreateForm({...createForm, membershipStatus})}>
                        <SelectTrigger id="create-membershipStatus">
                          <SelectValue placeholder="Select membership status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending - Awaiting payment</SelectItem>
                          <SelectItem value="approved">✅ Approved - Access granted (no payment yet)</SelectItem>
                          <SelectItem value="rejected">❌ Rejected - Access denied</SelectItem>
                          <SelectItem value="active">🎉 Active - Payment completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600 mt-1">Set to 'Active' if user has paid, otherwise 'Pending' or 'Approved'</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-green-900 mb-3">Account Flags</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="createOnboardingCompleted" 
                        checked={createForm.onboardingCompleted || false} 
                        onCheckedChange={checked => setCreateForm({...createForm, onboardingCompleted: checked as boolean})} 
                      />
                      <Label htmlFor="createOnboardingCompleted" className="cursor-pointer">
                        Onboarding Completed
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">Check if user should skip onboarding</p>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="createEmailVerified" 
                        checked={createForm.emailVerified || false} 
                        onCheckedChange={checked => setCreateForm({...createForm, emailVerified: checked as boolean})} 
                      />
                      <Label htmlFor="createEmailVerified" className="cursor-pointer">
                        Email Verified
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">Check if email is already confirmed</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSaveCreate} className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Create User Account
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}