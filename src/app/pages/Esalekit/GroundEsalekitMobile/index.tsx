import { Link as RouterLink, useParams } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Container, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GroundTablePreview from '../components/GroundTablePreview';

export default function GroundEsalekitMobile() {
  const { id } = useParams();
  return <div>{id && <GroundTablePreview id={id} />}</div>;
}
//62fd4434-53da-48ff-8c71-1a382e215934
