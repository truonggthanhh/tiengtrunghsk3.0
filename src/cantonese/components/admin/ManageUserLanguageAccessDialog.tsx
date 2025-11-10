import React, { useState, useEffect } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Globe } from 'lucide-react';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  cantonese_access?: boolean;
  mandarin_access?: boolean;
};

interface ManageUserLanguageAccessDialogProps {
  user: Profile | null;
  onClose: () => void;
}

const ManageUserLanguageAccessDialog = ({ user, onClose }: ManageUserLanguageAccessDialogProps) => {
  const queryClient = useQueryClient();
  const [cantoneseAccess, setCantoneseAccess] = useState(false);
  const [mandarinAccess, setMandarinAccess] = useState(false);

  useEffect(() => {
    if (user) {
      setCantoneseAccess(user.cantonese_access || false);
      setMandarinAccess(user.mandarin_access || false);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async ({ userId, cantonese, mandarin }: { userId: string; cantonese: boolean; mandarin: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          cantonese_access: cantonese,
          mandarin_access: mandarin,
        })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Đã cập nhật quyền truy cập ngôn ngữ.');
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(`Lỗi: ${err.message}`);
    },
  });

  const handleSave = () => {
    if (user) {
      mutation.mutate({
        userId: user.id,
        cantonese: cantoneseAccess,
        mandarin: mandarinAccess,
      });
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Quản lý quyền truy cập ngôn ngữ
          </DialogTitle>
          <DialogDescription>
            Cấp quyền truy cập cho <strong>{user?.first_name} {user?.last_name}</strong> vào các trang học ngôn ngữ.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border">
            <div className="flex-1">
              <Label htmlFor="cantonese-access" className="text-base font-semibold">
                Tiếng Quảng Đông (粵語)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Cho phép truy cập vào trang học tiếng Quảng Đông
              </p>
            </div>
            <Switch
              id="cantonese-access"
              checked={cantoneseAccess}
              onCheckedChange={setCantoneseAccess}
            />
          </div>

          <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border">
            <div className="flex-1">
              <Label htmlFor="mandarin-access" className="text-base font-semibold">
                Tiếng Trung (普通话)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Cho phép truy cập vào trang học tiếng Trung
              </p>
            </div>
            <Switch
              id="mandarin-access"
              checked={mandarinAccess}
              onCheckedChange={setMandarinAccess}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUserLanguageAccessDialog;
