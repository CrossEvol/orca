import axios from 'axios';
import { ChangeEvent, FC, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { MaxImageSize } from '../../../constants';
import { AlertActionTypes, AlertTypes, openAlert } from '../../../store/alert';
import { setCommunityLogo, setCommunityLogoPublicId, SettingsActionTypes } from '../../../store/settings';
import { Loading } from '../../ui';
import { UploadIcon } from '../../ui/icons';
import { Input, Label, Text } from './style';

interface UploadImageProps {
  imagePublicId?: string;
}

const uploadLogo = async ({ image, imagePublicId }) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('imagePublicId', imagePublicId);

  const newImage = await axios.post('/settings/upload-logo', formData);
  return newImage;
};

const UploadLogo: FC<UploadImageProps> = ({ imagePublicId }) => {
  const dispatch = useDispatch<Dispatch<SettingsActionTypes | AlertActionTypes>>();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync } = useMutation(uploadLogo);

  const handleChange = async (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files[0];

    if (!file) return;
    if (!file.type.match(/image-*/)) return;
    if (file.size >= MaxImageSize.Post) {
      alert(`File size should be less than ${MaxImageSize.Post / 1000000}MB`);
      return;
    }

    setIsLoading(true);
    try {
      const updateImage = await mutateAsync({
        image: file,
        imagePublicId: imagePublicId,
      });
      dispatch(setCommunityLogo(updateImage.data.communityLogo));
      dispatch(setCommunityLogoPublicId(updateImage.data.communityLogoPublicId));
      dispatch(openAlert({ type: AlertTypes.Success, message: 'Logo updated successfully.' }));
    } catch (error) {
      console.error('An error occurred while uploading an image: ', error);
    } finally {
      setIsLoading(false);
    }

    (e.target as HTMLInputElement) = null;
  };

  return (
    <div>
      <Input name="image" type="file" onChange={handleChange} id="logo-upload" accept="image/x-png,image/jpeg" />

      <Label htmlFor="logo-upload">
        {!isLoading && <UploadIcon width="16" />}

        <Text>{isLoading ? <Loading size="xxs" /> : 'Update'}</Text>
      </Label>
    </div>
  );
};

export default UploadLogo;
