'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword } from '@/actions/user';
import { PasswordInput } from '@/components/ui/password-input';
import { RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeManagementPage() {
  const { data: session, isPending } = useSession();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');


  // Fungsi untuk memuat data karyawan
  const loadEmployees = async () => {
    try {
      const users = await getUsers();
      setEmployees(users);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Gagal memuat data karyawan');
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama lengkap harus diisi');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Email tidak valid');
      return;
    }

    if (!department.trim()) {
      toast.error('Departemen harus diisi');
      return;
    }

    if (!editingEmployee) {
      if (!password) {
        toast.error('Kata sandi harus diisi untuk karyawan baru');
        return;
      }
      if (password.length < 8) {
        toast.error('Kata sandi minimal 8 karakter');
        return;
      }
    }

    setIsSaving(true);

    try {
      if (editingEmployee) {
        // Update existing employee
        await updateUser(editingEmployee.id, {
          name: name.trim(),
          email: email.trim(),
          role: role as any,
          department: department.trim(),
        });
        toast.success('Data karyawan berhasil diperbarui!');
      } else {
        // Create new employee
        await createUser({
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: role as any,
          department: department.trim(),
        });
        toast.success('Karyawan baru berhasil ditambahkan!');
      }

      // Reset form
      setName('');
      setEmail('');
      setRole('employee');
      setDepartment('');
      setPassword('');
      setIsDialogOpen(false);
      setEditingEmployee(null);

      // Reload data
      loadEmployees();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast.error(error.message || 'Gagal menyimpan data karyawan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setRole(employee.role);
    setDepartment(employee.department || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      try {
        await deleteUser(id);
        toast.success('Karyawan berhasil dihapus!');
        loadEmployees(); // Refresh data
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        toast.error(error.message || 'Gagal menghapus karyawan');
      }
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin mereset password untuk ${name} menjadi 'User!2332!'?`)) {
      try {
        const result = await resetUserPassword(id);
        if (result.success) {
          toast.success(result.message || 'Password berhasil direset!');
        } else {
          toast.error('Gagal mereset password');
        }
      } catch (error: any) {
        console.error('Error resetting password:', error);
        toast.error(error.message || 'Gagal mereset password');
      }
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Karyawan</h1>
        <p className="text-gray-600">Kelola data karyawan di sini</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Karyawan</CardTitle>
            <CardDescription>Daftar seluruh karyawan dalam sistem</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingEmployee(null);
                setName('');
                setEmail('');
                setRole('employee');
                setDepartment('');
                setPassword('');
              }}>
                Tambah Karyawan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingEmployee
                    ? `Edit data untuk ${editingEmployee.name}`
                    : 'Masukkan data karyawan baru'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {!editingEmployee && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <PasswordInput
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!editingEmployee}
                      placeholder="Masukkan kata sandi awal"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Karyawan</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departemen</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Masukkan nama departemen"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" disabled={isSaving} onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingEmployee ? 'Memperbarui...' : 'Menyimpan...'}
                      </>
                    ) : (
                      editingEmployee ? 'Update' : 'Simpan'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name || '-'}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${employee.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {employee.role === 'admin' ? 'Admin' : 'Karyawan'}
                      </span>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => handleResetPassword(employee.id, employee.name)}
                          title="Reset Password"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}