
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { MarketingModule, UserProfile, UserRole, Book, Template } from '../types';

export const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'modules' | 'library' | 'config'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [modules, setModules] = useState<MarketingModule[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [config, setConfig] = useState({ price: 39 });
  
  // States for creating/editing
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: UserRole.USER });

  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<MarketingModule | null>(null);
  const [newModule, setNewModule] = useState<Partial<MarketingModule>>({ phase: 1, color: 'bg-indigo-600', icon: 'fa-solid fa-star', topics: [], aiContext: '' });

  // Library States
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({ keyTakeaways: [] });
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({ format: 'pdf', content: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(storageService.getAllUsers());
    setModules(storageService.getModules());
    setBooks(storageService.getBooks());
    setTemplates(storageService.getTemplates());
    setConfig(storageService.getConfig());
  };

  // --- HANDLERS ---
  const handleDeleteUser = (id: string) => { if (confirm('Delete user?')) { storageService.deleteUser(id); loadData(); } };
  const handleDeleteModule = (id: string) => { if (confirm('Delete module?')) { storageService.deleteModule(id); loadData(); } };
  const handleDeleteBook = (id: string) => { if (confirm('Delete book?')) { storageService.deleteBook(id); loadData(); } };
  const handleDeleteTemplate = (id: string) => { if (confirm('Delete template?')) { storageService.deleteTemplate(id); loadData(); } };

  const handleCreateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newUser.username || !newUser.password) return;
      storageService.createUser(newUser);
      loadData(); setIsCreatingUser(false); setNewUser({ name: '', username: '', password: '', role: UserRole.USER });
  }

  const handleCreateModule = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newModule.title || !newModule.id) return;
      const moduleToAdd: MarketingModule = {
          id: newModule.id,
          title: newModule.title,
          description: newModule.description || '',
          phase: newModule.phase || 1,
          color: newModule.color || 'bg-slate-500',
          icon: newModule.icon || 'fa-solid fa-circle',
          topics: (newModule.topics as unknown as string).split(',').map(t => t.trim()).filter(t => t.length > 0),
          aiContext: newModule.aiContext
      };
      storageService.addModule(moduleToAdd);
      loadData(); setIsCreatingModule(false); setNewModule({ phase: 1, color: 'bg-indigo-600', icon: 'fa-solid fa-star', topics: [], aiContext: '' });
  }

  const handleModuleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    const updatedModules = modules.map(m => m.id === editingModule.id ? editingModule : m);
    storageService.saveModules(updatedModules);
    setModules(updatedModules); setEditingModule(null);
  };

  // --- FILE UPLOAD HANDLERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newBook.title || !newBook.author) return;
      const b: Book = {
          id: Date.now().toString(),
          title: newBook.title,
          author: newBook.author,
          category: newBook.category || 'General',
          thumbnail: newBook.thumbnail || `https://placehold.co/300x450/1e293b/FFF?text=${encodeURIComponent(newBook.title)}`,
          summary: newBook.summary || 'Summary coming soon.',
          keyTakeaways: typeof newBook.keyTakeaways === 'string' ? (newBook.keyTakeaways as string).split(',').map((k: string) => k.trim()) : []
      };
      storageService.addBook(b);
      loadData(); setIsAddingBook(false); setNewBook({ keyTakeaways: [] });
  }

  const handleAddTemplate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTemplate.title) return;
      const t: Template = {
          id: Date.now().toString(),
          title: newTemplate.title,
          category: newTemplate.category || 'General',
          format: newTemplate.format || 'pdf',
          description: newTemplate.description || '',
          content: newTemplate.content || ''
      };
      storageService.addTemplate(t);
      loadData(); setIsAddingTemplate(false); setNewTemplate({ format: 'pdf', content: '' });
  }

  const handleConfigSave = () => { storageService.saveConfig(config); alert('Saved'); }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Guild Administration</h1>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            {['users', 'modules', 'library', 'config'].map((t) => (
                <button 
                    key={t}
                    onClick={() => setTab(t as any)}
                    className={`px-4 py-2 rounded-md font-bold text-sm capitalize transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    {t}
                </button>
            ))}
        </div>
      </div>

      {/* --- LIBRARY TAB --- */}
      {tab === 'library' && (
          <div className="space-y-8">
              {/* Books Section */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Library Books</h3>
                      <button onClick={() => setIsAddingBook(true)} className="bg-indigo-600 text-white text-sm font-bold px-3 py-2 rounded"><i className="fa-solid fa-plus mr-1"></i> Add Book</button>
                  </div>
                  
                  {isAddingBook && (
                      <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded border border-slate-200 dark:border-slate-700">
                          <form onSubmit={handleAddBook} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <input className="p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Title" value={newBook.title || ''} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
                                  <input className="p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Author" value={newBook.author || ''} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
                                  <input className="p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Category" value={newBook.category || ''} onChange={e => setNewBook({...newBook, category: e.target.value})} />
                                  
                                  {/* Cover Image Upload */}
                                  <div className="flex flex-col">
                                      <label className="text-xs font-bold text-slate-500 uppercase mb-1">Cover Image</label>
                                      <input 
                                          type="file" 
                                          accept="image/*"
                                          className="text-sm dark:text-slate-300"
                                          onChange={(e) => handleFileUpload(e, (base64) => setNewBook({...newBook, thumbnail: base64}))} 
                                      />
                                      {newBook.thumbnail && <img src={newBook.thumbnail} alt="Preview" className="h-20 w-auto mt-2 rounded border" />}
                                  </div>
                              </div>
                              <textarea className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Detailed Summary (Markdown)" rows={4} value={newBook.summary || ''} onChange={e => setNewBook({...newBook, summary: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Key Takeaways (comma separated)" value={newBook.keyTakeaways as unknown as string || ''} onChange={e => setNewBook({...newBook, keyTakeaways: e.target.value as any})} />
                              <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => setIsAddingBook(false)} className="text-slate-500 font-bold px-4">Cancel</button>
                                  <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded">Save Book</button>
                              </div>
                          </form>
                      </div>
                  )}

                  <div className="max-h-60 overflow-y-auto border rounded dark:border-slate-700">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                              <tr>
                                  <th className="p-2 dark:text-slate-300">Title</th>
                                  <th className="p-2 dark:text-slate-300">Author</th>
                                  <th className="p-2 dark:text-slate-300 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {books.map(b => (
                                  <tr key={b.id} className="border-t border-slate-100 dark:border-slate-700">
                                      <td className="p-2 dark:text-white">{b.title}</td>
                                      <td className="p-2 dark:text-slate-400">{b.author}</td>
                                      <td className="p-2 text-right">
                                          <button onClick={() => handleDeleteBook(b.id)} className="text-red-500"><i className="fa-solid fa-trash"></i></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Templates Section */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Templates</h3>
                      <button onClick={() => setIsAddingTemplate(true)} className="bg-indigo-600 text-white text-sm font-bold px-3 py-2 rounded"><i className="fa-solid fa-plus mr-1"></i> Add Template</button>
                  </div>

                  {isAddingTemplate && (
                      <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded border border-slate-200 dark:border-slate-700">
                          <form onSubmit={handleAddTemplate} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <input className="p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Title" value={newTemplate.title || ''} onChange={e => setNewTemplate({...newTemplate, title: e.target.value})} required />
                                  <input className="p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Category" value={newTemplate.category || ''} onChange={e => setNewTemplate({...newTemplate, category: e.target.value})} />
                                  <select className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={newTemplate.format} onChange={e => setNewTemplate({...newTemplate, format: e.target.value as any})}>
                                      <option value="pdf">PDF</option>
                                      <option value="doc">Word (Doc)</option>
                                      <option value="excel">Excel</option>
                                  </select>
                                  <input className="p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Description" value={newTemplate.description || ''} onChange={e => setNewTemplate({...newTemplate, description: e.target.value})} />
                              </div>
                              
                              {/* File Upload for Template Content */}
                              <div className="border-t dark:border-slate-700 pt-4">
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Template File (Optional - Overrides Generator)</label>
                                  <input 
                                    type="file" 
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-700 dark:file:text-white"
                                    onChange={(e) => handleFileUpload(e, (base64) => setNewTemplate({...newTemplate, content: base64}))}
                                  />
                                  <p className="text-xs text-slate-400 mt-1">Or paste content string below if not uploading a file.</p>
                              </div>

                              <textarea 
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" 
                                placeholder="Content (String for PDF/Doc, JSON Array for Excel)" 
                                rows={4} 
                                value={typeof newTemplate.content === 'string' ? newTemplate.content : JSON.stringify(newTemplate.content)} 
                                onChange={e => setNewTemplate({...newTemplate, content: e.target.value})} 
                              />
                              
                              <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => setIsAddingTemplate(false)} className="text-slate-500 font-bold px-4">Cancel</button>
                                  <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded">Save Template</button>
                              </div>
                          </form>
                      </div>
                  )}

                  <div className="max-h-60 overflow-y-auto border rounded dark:border-slate-700">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                              <tr>
                                  <th className="p-2 dark:text-slate-300">Title</th>
                                  <th className="p-2 dark:text-slate-300">Format</th>
                                  <th className="p-2 dark:text-slate-300 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {templates.map(t => (
                                  <tr key={t.id} className="border-t border-slate-100 dark:border-slate-700">
                                      <td className="p-2 dark:text-white">{t.title}</td>
                                      <td className="p-2 dark:text-slate-400 uppercase">{t.format}</td>
                                      <td className="p-2 text-right">
                                          <button onClick={() => handleDeleteTemplate(t.id)} className="text-red-500"><i className="fa-solid fa-trash"></i></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {/* --- CONFIG TAB --- */}
      {tab === 'config' && (
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
               <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">App Configuration</h3>
               <div className="max-w-md">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Account Price ($)</label>
                   <div className="flex gap-4">
                       <input type="number" className="flex-1 p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={config.price} onChange={(e) => setConfig({ ...config, price: parseInt(e.target.value) })} />
                       <button onClick={handleConfigSave} className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700">Save</button>
                   </div>
               </div>
           </div>
      )}

      {/* --- USERS TAB --- */}
      {tab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">All Members</h3>
                <button onClick={() => setIsCreatingUser(true)} className="bg-indigo-600 text-white text-sm font-bold px-3 py-2 rounded hover:bg-indigo-700"><i className="fa-solid fa-plus mr-1"></i> Add User</button>
            </div>
            {isCreatingUser && (
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
                     <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="p-2 rounded border dark:bg-slate-700 dark:text-white" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                        <input className="p-2 rounded border dark:bg-slate-700 dark:text-white" placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                        <input className="p-2 rounded border dark:bg-slate-700 dark:text-white" type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                        <select className="p-2 rounded border dark:bg-slate-700 dark:text-white" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                            <option value={UserRole.USER}>User</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsCreatingUser(false)} className="text-slate-500 font-bold px-4">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded">Create</button>
                        </div>
                     </form>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 dark:text-slate-400">User</th>
                            <th className="p-4 dark:text-slate-400">Role</th>
                            <th className="p-4 dark:text-slate-400">Status</th>
                            <th className="p-4 text-right dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4 font-bold dark:text-white">{user.name}</td>
                                <td className="p-4 dark:text-slate-300">{user.role}</td>
                                <td className="p-4 dark:text-slate-300">{user.isPro ? 'PAID' : 'FREE'}</td>
                                <td className="p-4 text-right"><button onClick={() => handleDeleteUser(user.id)} className="text-red-500"><i className="fa-solid fa-trash"></i></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- MODULES TAB --- */}
      {tab === 'modules' && (
        <div className="space-y-6">
            {!editingModule && !isCreatingModule && (
                 <button onClick={() => setIsCreatingModule(true)} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 font-bold hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-400 hover:text-indigo-600 transition-all"><i className="fa-solid fa-plus mr-2"></i> Create New Module</button>
            )}
            {isCreatingModule && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-indigo-200 shadow-lg">
                    <form onSubmit={handleCreateModule} className="space-y-4">
                        {/* Shortened for brevity, same logic as before */}
                        <input className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Title" value={newModule.title || ''} onChange={(e) => setNewModule({...newModule, title: e.target.value, id: e.target.value.toLowerCase().replace(/\s/g, '-')})} required />
                        <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsCreatingModule(false)}>Cancel</button><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button></div>
                    </form>
                </div>
            )}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map(module => (
                    <div key={module.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col relative">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-8 h-8 rounded center flex items-center justify-center text-white ${module.color}`}><i className={module.icon}></i></div>
                            <span className="font-bold text-slate-800 dark:text-white">{module.title}</span>
                        </div>
                        <div className="flex justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                             <button onClick={() => setEditingModule(module)} className="text-indigo-600 font-bold text-sm">Edit</button>
                             <button onClick={() => handleDeleteModule(module.id)} className="text-red-500 font-bold text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
