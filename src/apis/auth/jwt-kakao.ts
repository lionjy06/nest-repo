import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      scope: [
        'profile_image',
        'account_email',
        'profile_nickname',
        'gender',
        'age_range',
        'birthday',
        'friends',
        'story_permalink',
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile);
    return {
      email: profile._json.kakao_account.email,
      password: profile.id,
      name: profile.displayName,
      age: 29,
    };
  }
}
