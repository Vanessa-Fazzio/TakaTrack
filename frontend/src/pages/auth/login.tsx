import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { bootstrapStyles, BootstrapButton, colors, spacing, typography } from '../styles/bootstrapStyles';

type UserType = 'user' | 'admin' | 'collector';

export default function LoginScreen() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user' as UserType,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (userType: UserType) => {
    setFormData(prev => ({ ...prev, userType }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', `Welcome back ${formData.userType === 'user' ? 'Eco Warrior' : formData.userType === 'admin' ? 'Administrator' : 'Collection Partner'}!`, [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    }, 1500);
  };

  const getUserTypeConfig = (type: UserType) => {
    const config = {
      user: {
        icon: 'person',
        title: 'Eco User',
        description: 'Track your recycling and manage waste',
        color: colors.primary,
      },
      admin: {
        icon: 'shield',
        title: 'Administrator',
        description: 'Manage system and view analytics',
        color: colors.info,
      },
      collector: {
        icon: 'business',
        title: 'Collector',
        description: 'Manage collections and routes',
        color: colors.success,
      },
    };
    return config[type];
  };

  return (
    <ScrollView style={[bootstrapStyles.container, { padding: spacing[4] }]} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header Section */}
      <View style={{ alignItems: 'center', marginBottom: spacing[6], marginTop: spacing[4] }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing[4],
        }}>
          <Ionicons name="leaf" size={40} color={colors.white} />
        </View>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing[2] }]}>
          Welcome Back
        </Text>
        <Text style={[typography.body, { color: colors.gray600, textAlign: 'center' }]}>
          Sign in to continue your eco-friendly journey
        </Text>
      </View>

      {/* User Type Selection */}
      <View style={{ marginBottom: spacing[4] }}>
        <Text style={[typography.h6, { marginBottom: spacing[3], textAlign: 'center' }]}>
          I am a...
        </Text>
        <View style={bootstrapStyles.row}>
          {(['user', 'admin', 'collector'] as UserType[]).map((type) => {
            const config = getUserTypeConfig(type);
            const isSelected = formData.userType === type;
            
            return (
              <View key={type} style={[bootstrapStyles.col4, { marginBottom: spacing[2] }]}>
                <TouchableOpacity
                  style={[
                    bootstrapStyles.card,
                    {
                      alignItems: 'center',
                      padding: spacing[2],
                      borderWidth: 2,
                    borderColor: isSelected ? config.color : colors.gray300,
                      backgroundColor: isSelected ? `${config.color}10` : colors.white,
                    }
                  ]}
                  onPress={() => handleUserTypeSelect(type)}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isSelected ? config.color : colors.gray200,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing[1],
                  }}>
                    <Ionicons name={config.icon as any} size={20} color={isSelected ? colors.white : colors.gray600} />
                  </View>
                  <Text style={[
                    typography.small,
                    { 
                      fontWeight: '600',
                      textAlign: 'center',
                      color: isSelected ? config.color : colors.gray600
                    }
                  ]}>
                    {config.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Login Form */}
      <View style={bootstrapStyles.card}>
        <View style={bootstrapStyles.cardBody}>
          {/* Email Input */}
          <View style={bootstrapStyles.formGroup}>
            <Text style={bootstrapStyles.formLabel}>Email Address</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[bootstrapStyles.formControl, { paddingLeft: spacing[9] }]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={{
                position: 'absolute',
                left: spacing[3],
                top: spacing[2],
                zIndex: 1,
              }}>
                <Ionicons name="mail" size={20} color={colors.gray500} />
              </View>
            </View>
          </View>

          {/* Password Input */}
          <View style={bootstrapStyles.formGroup}>
            <Text style={bootstrapStyles.formLabel}>Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[bootstrapStyles.formControl, { paddingLeft: spacing[9], paddingRight: spacing[9] }]}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="Enter your password"
                placeholderTextColor={colors.gray500}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <View style={{
                position: 'absolute',
                left: spacing[3],
                top: spacing[2],
                zIndex: 1,
              }}>
                <Ionicons name="lock-closed" size={20} color={colors.gray500} />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: spacing[3],
                  top: spacing[2],
                  zIndex: 1,
                }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray500}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: colors.primary,
                marginRight: spacing[2],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name="checkmark" size={14} color={colors.primary} />
              </View>
              <Text style={[typography.small, { color: colors.gray700 }]}>Remember me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Text style={[typography.small, { color: colors.primary, fontWeight: '600' }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <BootstrapButton
            title={`Sign In as ${getUserTypeConfig(formData.userType).title}`}
            onPress={handleLogin}
            loading={isLoading}
            style={{ width: '100%', marginBottom: spacing[3] }}
          />

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing[4] }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray300 }} />
            <Text style={[typography.small, { color: colors.gray600, marginHorizontal: spacing[2] }]}>
              Or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray300 }} />
          </View>

          {/* Social Login Buttons */}
          <View style={bootstrapStyles.row}>
            <View style={[bootstrapStyles.col6, { marginBottom: spacing[2] }]}>
              <TouchableOpacity 
                style={[
                  bootstrapStyles.btn, 
                  bootstrapStyles.btnOutlinePrimary, 
                  { width: '100%', borderColor: colors.gray400 }
                ]}
                onPress={() => Alert.alert('Google Login', 'Google authentication would be implemented here')}
              >
                <Ionicons name="logo-google" size={20} color={colors.gray600} style={{ marginRight: spacing[2] }} />
                <Text style={[bootstrapStyles.btnOutlineText, { color: colors.gray700 }]}>Google</Text>
              </TouchableOpacity>
            </View>
            <View style={[bootstrapStyles.col6, { marginBottom: spacing[2] }]}>
              <TouchableOpacity 
                style={[
                  bootstrapStyles.btn, 
                  bootstrapStyles.btnOutlinePrimary, 
                  { width: '100%', borderColor: colors.gray400 }
                ]}
                onPress={() => Alert.alert('Apple Login', 'Apple authentication would be implemented here')}
              >
                <Ionicons name="logo-apple" size={20} color={colors.gray600} style={{ marginRight: spacing[2] }} />
                <Text style={[bootstrapStyles.btnOutlineText, { color: colors.gray700 }]}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Sign Up Link */}
      <View style={{ alignItems: 'center', marginTop: spacing[4], marginBottom: spacing[6] }}>
        <Text style={[typography.body, { color: colors.gray600 }]}>
          Don't have an account?{' '}
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </Text>
      </View>

      {/* App Info */}
      <View style={{ alignItems: 'center', marginTop: 'auto' }}>
        <Text style={[typography.small, { color: colors.gray600 }]}>
          TakaTrack v1.0.0
        </Text>
        <Text style={[typography.small, { color: colors.gray600 }]}>
          Making the world greener, one recycle at a time ♻️
        </Text>
      </View>
    </ScrollView>
  );
}