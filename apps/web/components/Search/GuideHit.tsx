import Tags from '../Tags/Tags'
import BorderSVG from '../SVG/BorderSVG'
import UserAvatar from '@app/components/UserAvatar/UserAvatar'
import routes from '../../routes'
import Link from 'next/link'

const GuideHit = props => {
  return (
    <div className='mb-8 text-kafeblack dark:text-kafewhite z-10 relative min-w-[800px]'>
      <BorderSVG />
      <div className='p-6'>
        <div className='flex flex-row justify-between'>
          <div className='flex items-center p-6'>
            <p>Guide by</p>
            <UserAvatar address={props.hit.author} />
          </div>
        </div>
        <div className='flex flex-row content-center justify-between px-4 py-5 sm:p-6'>
          <div>
            <div className='mb-4'>
              <div className='font-bold font-larken text-5xl tracking-wider'>
                <Link href={routes.learn.guide(props.hit.slug)}>
                  {props.hit.title}
                </Link>
              </div>
              {/*<div className='font-thin tracking-wider text-sm leading-6 pt-2 pb-6'>*/}
              {/*  {props.hit.description}*/}
              {/*</div>*/}
            </div>
            <div className='mb-4'>
              <Tags tags={props.hit.tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideHit
